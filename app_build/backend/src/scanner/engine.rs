use std::collections::VecDeque;
use tokio::io::{AsyncBufReadExt, BufReader};
use regex::{Regex, RegexBuilder};
use crate::models::{MatchEntry, PatternMode, ScanConfig, ScanEvent};
use tokio::sync::broadcast;
use tokio::io::AsyncRead;

pub struct ScanEngine {
    config: ScanConfig,
    keywords: Vec<String>,
    regexes: Vec<Regex>,
}

impl ScanEngine {
    pub fn new(config: ScanConfig) -> Result<Self, String> {
        let keywords: Vec<String> = config.keywords
            .lines()
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        if keywords.is_empty() {
            return Err("No keywords provided".to_string());
        }

        let mut regexes = Vec::new();
        if matches!(config.pattern_mode, PatternMode::Regex) {
            for kw in &keywords {
                let mut builder = RegexBuilder::new(kw);
                builder.case_insensitive(config.case_sensitive == "false");
                match builder.build() {
                    Ok(re) => regexes.push(re),
                    Err(e) => return Err(format!("Invalid regex '{}': {}", kw, e)),
                }
            }
        }

        Ok(Self { config, keywords, regexes })
    }

    pub async fn process_file_stream<R: AsyncRead + Unpin>(
        &self,
        file_index: usize,
        file_name: String,
        reader: R,
        total_bytes: u64,
        tx: broadcast::Sender<ScanEvent>,
    ) {
        let _ = tx.send(ScanEvent::FileStart {
            file_name: file_name.clone(),
            file_index,
            total_bytes,
        });

        let mut reader = BufReader::new(reader);
        let mut lines_scanned = 0;
        let mut matches_found = 0;
        let mut bytes_read = 0;
        let mut before_buffer: VecDeque<String> = VecDeque::with_capacity(self.config.context_lines);
        
        let mut line = String::new();
        let mut pending_match: Option<MatchEntry> = None;
        let mut lines_after_needed = 0;

        loop {
            line.clear();
            match reader.read_line(&mut line).await {
                Ok(0) => break,
                Ok(n) => {
                    bytes_read += n as u64;
                    lines_scanned += 1;
                    let line_content = line.trim_end().to_string();

                    if let Some(ref mut m) = pending_match {
                        m.context_after.push(line_content.clone());
                        lines_after_needed -= 1;
                        if lines_after_needed == 0 {
                            let _ = tx.send(ScanEvent::Match(pending_match.take().unwrap()));
                        }
                    }

                    let mut found_kw = None;
                    if matches!(self.config.pattern_mode, PatternMode::Regex) {
                        for (i, re) in self.regexes.iter().enumerate() {
                            if re.is_match(&line_content) {
                                found_kw = Some(self.keywords[i].clone());
                                break;
                            }
                        }
                    } else {
                        let is_case_insensitive = self.config.case_sensitive == "false";
                        let search_content = if is_case_insensitive { line_content.to_lowercase() } else { line_content.clone() };
                        for kw in &self.keywords {
                            let search_kw = if is_case_insensitive { kw.to_lowercase() } else { kw.clone() };
                            if search_content.contains(&search_kw) {
                                found_kw = Some(kw.clone());
                                break;
                            }
                        }
                    }

                    if let Some(kw) = found_kw {
                        matches_found += 1;
                        if let Some(m) = pending_match.take() {
                            let _ = tx.send(ScanEvent::Match(m));
                        }

                        let match_entry = MatchEntry {
                            file_index,
                            file_name: file_name.clone(),
                            line_number: lines_scanned,
                            keyword: kw,
                            content: line_content.clone(),
                            context_before: before_buffer.iter().cloned().collect(),
                            context_after: Vec::new(),
                        };

                        if self.config.context_lines > 0 {
                            pending_match = Some(match_entry);
                            lines_after_needed = self.config.context_lines;
                        } else {
                            let _ = tx.send(ScanEvent::Match(match_entry));
                        }

                        if self.config.max_matches_per_file > 0 && matches_found >= self.config.max_matches_per_file {
                            break;
                        }
                    }

                    if self.config.context_lines > 0 {
                        if before_buffer.len() >= self.config.context_lines {
                            before_buffer.pop_front();
                        }
                        before_buffer.push_back(line_content);
                    }

                    if lines_scanned % 1000 == 0 {
                        let _ = tx.send(ScanEvent::Progress {
                            file_index,
                            bytes_read,
                            lines_scanned,
                            matches_found,
                        });
                    }
                }
                Err(_) => break,
            }
        }

        if let Some(m) = pending_match {
            let _ = tx.send(ScanEvent::Match(m));
        }

        let _ = tx.send(ScanEvent::FileDone {
            file_index,
            total_lines: lines_scanned,
            total_matches: matches_found,
        });
    }
}

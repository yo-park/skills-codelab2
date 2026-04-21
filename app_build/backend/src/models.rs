use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum PatternMode {
    #[serde(rename = "literal")]
    Literal,
    #[serde(rename = "regex")]
    Regex,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScanConfig {
    pub keywords: String,
    pub pattern_mode: PatternMode,
    pub case_sensitive: String, // from multipart boolean is string
    pub context_lines: usize,
    pub concurrency: usize,
    pub max_matches_per_file: usize,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
pub struct MatchEntry {
    pub file_index: usize,
    pub file_name: String,
    pub line_number: usize,
    pub keyword: String,
    pub content: String,
    pub context_before: Vec<String>,
    pub context_after: Vec<String>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(tag = "type", content = "data")]
pub enum ScanEvent {
    #[serde(rename = "file_start")]
    FileStart {
        file_name: String,
        file_index: usize,
        total_bytes: u64,
    },
    #[serde(rename = "progress")]
    Progress {
        file_index: usize,
        bytes_read: u64,
        lines_scanned: usize,
        matches_found: usize,
    },
    #[serde(rename = "match")]
    Match(MatchEntry),
    #[serde(rename = "file_done")]
    FileDone {
        file_index: usize,
        total_lines: usize,
        total_matches: usize,
    },
    #[serde(rename = "scan_done")]
    ScanDone {
        total_files: usize,
        total_matches: usize,
    },
    #[serde(rename = "error")]
    Error { message: String },
}

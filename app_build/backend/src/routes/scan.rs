use axum::{
    extract::{Multipart, Path},
    Json,
};
use serde_json::json;
use uuid::Uuid;
use tokio::sync::broadcast;
use tokio_util::sync::CancellationToken;
use tokio_util::io::StreamReader;
use crate::models::{ScanConfig, ScanEvent, PatternMode};
use crate::scanner::engine::ScanEngine;
use crate::scanner::session::{ScanSession, SESSIONS};
use futures::TryStreamExt;
use std::sync::Arc;

pub async fn start_scan(mut multipart: Multipart) -> Result<Json<serde_json::Value>, String> {
    let mut config = ScanConfig {
        keywords: String::new(),
        pattern_mode: PatternMode::Literal,
        case_sensitive: "false".to_string(),
        context_lines: 0,
        concurrency: 1,
        max_matches_per_file: 0,
    };

    // Store fields to process later? No, we must process files sequentially 
    // to maintain streaming without buffering everything.
    // However, if config fields come AFTER files, we have a problem.
    // We'll assume for now that simple metadata comes early or we buffer metadata only.
    
    let scan_id = Uuid::new_v4().to_string();
    let (tx, _) = broadcast::channel(5000);
    let cancellation_token = CancellationToken::new();

    tracing::info!("Starting scan request, generated scan_id: {}", scan_id);

    SESSIONS.insert(scan_id.clone(), ScanSession {
        tx: tx.clone(),
        cancellation_token: cancellation_token.clone(),
    });

    let scan_id_clone = scan_id.clone();
    let tx_clone = tx.clone();
    let cancel_clone = cancellation_token.clone();

    tokio::spawn(async move {
        tracing::info!("Spawned scan task for {}", scan_id_clone);
        let mut file_index = 0;
        let mut engine = None;

        while let Ok(Some(field)) = multipart.next_field().await {
            if cancel_clone.is_cancelled() { 
                tracing::info!("Scan {} cancelled", scan_id_clone);
                break; 
            }
            
            let name = field.name().unwrap_or("").to_string();
            if name == "files" {
                let file_name = field.file_name().unwrap_or("unknown").to_string();
                tracing::info!("Processing file: {} (index {})", file_name, file_index);
                
                // Lazy-initialize engine if we haven't yet (assuming config came first)
                if engine.is_none() {
                    match ScanEngine::new(config.clone()) {
                        Ok(e) => {
                            engine = Some(Arc::new(e));
                        }
                        Err(e) => {
                            tracing::error!("Failed to initialize ScanEngine: {}", e);
                            let _ = tx_clone.send(ScanEvent::Error { message: e });
                            break;
                        }
                    }
                }

                if let Some(ref e) = engine {
                    let stream = field.map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e));
                    let reader = StreamReader::new(stream);
                    e.process_file_stream(file_index, file_name, reader, 0, tx_clone.clone()).await;
                    file_index += 1;
                }
            } else {
                if let Ok(value) = field.text().await {
                    match name.as_str() {
                        "keywords" => config.keywords = value,
                        "pattern_mode" => config.pattern_mode = if value == "regex" { PatternMode::Regex } else { PatternMode::Literal },
                        "case_sensitive" => config.case_sensitive = value,
                        "context_lines" => config.context_lines = value.parse::<usize>().unwrap_or(0).min(100),
                        "concurrency" => config.concurrency = value.parse::<usize>().unwrap_or(1).min(10),
                        "max_matches_per_file" => config.max_matches_per_file = value.parse().unwrap_or(0),
                        _ => {}
                    }
                }
            }
        }

        tracing::info!("Scan {} completed, total files: {}", scan_id_clone, file_index);
        let _ = tx_clone.send(ScanEvent::ScanDone {
            total_files: file_index,
            total_matches: 0,
        });

        // Keep session for a while to allow UI to finish reading
        tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
        tracing::info!("Removing session {}", scan_id_clone);
        SESSIONS.remove(&scan_id_clone);
    });

    Ok(Json(json!({ "scan_id": scan_id })))
}

pub async fn stop_scan(Path(scan_id): Path<String>) -> Json<serde_json::Value> {
    if let Some(session) = SESSIONS.get(&scan_id) {
        session.cancellation_token.cancel();
    }
    Json(json!({ "status": "stopped" }))
}

use axum::{
    extract::Path,
    response::sse::{Event, Sse},
};
use futures::stream::Stream;
use std::convert::Infallible;
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::StreamExt;
use crate::scanner::session::SESSIONS;

pub async fn sse_handler(
    Path(id): Path<String>,
) -> Result<Sse<impl Stream<Item = Result<Event, Infallible>>>, axum::http::StatusCode> {
    tracing::info!("SSE connection attempt for session: {}", id);
    
    let rx = SESSIONS.get(&id)
        .map(|s| {
            tracing::info!("Found session: {}", id);
            s.tx.subscribe()
        })
        .ok_or_else(|| {
            tracing::warn!("Session not found: {}", id);
            axum::http::StatusCode::NOT_FOUND
        })?;

    let stream = BroadcastStream::new(rx).filter_map(|msg| {
        match msg {
            Ok(event) => {
                let event_name = match &event {
                    crate::models::ScanEvent::FileStart { .. } => "file_start",
                    crate::models::ScanEvent::Progress { .. } => "progress",
                    crate::models::ScanEvent::Match(_) => "match",
                    crate::models::ScanEvent::FileDone { .. } => "file_done",
                    crate::models::ScanEvent::ScanDone { .. } => "scan_done",
                    crate::models::ScanEvent::Error { .. } => "error",
                };
                let data = serde_json::to_string(&event).unwrap_or_default();
                Some(Ok(Event::default().event(event_name).data(data)))
            },
            Err(_) => None,
        }
    });

    Ok(Sse::new(stream))
}

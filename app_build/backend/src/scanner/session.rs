use dashmap::DashMap;
use tokio::sync::broadcast;
use tokio_util::sync::CancellationToken;
use crate::models::ScanEvent;
use lazy_static::lazy_static;

pub struct ScanSession {
    pub tx: broadcast::Sender<ScanEvent>,
    pub cancellation_token: CancellationToken,
}

lazy_static! {
    pub static ref SESSIONS: DashMap<String, ScanSession> = DashMap::new();
}

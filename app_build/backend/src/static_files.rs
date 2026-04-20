use rust_embed::RustEmbed;
use axum::{
    response::{IntoResponse, Response},
    http::{header, StatusCode, Uri},
};

#[derive(RustEmbed)]
#[folder = "../frontend/dist/"]
struct Asset;

pub async fn static_handler(uri: Uri) -> impl IntoResponse {
    let path = uri.path().trim_start_matches('/');

    if path.is_empty() || path == "index.html" {
        return index_html().into_response();
    }

    match Asset::get(path) {
        Some(content) => {
            let mime = mime_guess::from_path(path).first_or_octet_stream();
            ([(header::CONTENT_TYPE, mime.as_ref())], content.data).into_response()
        }
        None => {
            if path.contains('.') {
                return StatusCode::NOT_FOUND.into_response();
            }
            index_html().into_response()
        }
    }
}

fn index_html() -> Response {
    match Asset::get("index.html") {
        Some(content) => ([(header::CONTENT_TYPE, "text/html")], content.data).into_response(),
        None => StatusCode::NOT_FOUND.into_response(),
    }
}

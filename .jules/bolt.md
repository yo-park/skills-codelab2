## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-05-03 - Throttle High-Frequency Zustand Updates and Avoid ES6 Maps
**Learning:** High-frequency SSE stream updates (like scan progress events) can cause severe React re-render churn if applied directly to a Zustand store, especially when using complex objects like ES6 Maps that defeat shallow equality checks and serialize poorly.
**Action:** Always buffer and throttle high-frequency stream events (e.g. 100ms `setTimeout`), use plain JavaScript `Record`s instead of Maps for store state to ensure efficient updates and equality checking, and explicitly flush the buffer when the stream completes (`scan_done` or `onerror`).

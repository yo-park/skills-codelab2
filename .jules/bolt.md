## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-04-20 - High-Frequency React State Updates via Zustand with SSE
**Learning:** In the frontend, the high-frequency SSE event stream (`progress`) was triggering heavy UI updates. Using ES6 `Map` in Zustand necessitated copying the entire Map on every small progression update (`new Map(state.fileProgress)`), heavily taxing CPU and GC. Using a native JavaScript `Record` object combined with a 100ms throttling buffer on incoming events radically reduced React component re-renders.
**Action:** Always prefer basic JS `Record` types over `Map` in Zustand for fast immutable updates, and strictly buffer/throttle high-frequency streamed events (e.g. SSE/WebSockets) before applying them to React state to prevent render churn.

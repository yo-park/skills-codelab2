## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-05-01 - Throttling High-Frequency SSE Events in Zustand
**Learning:** Using an ES6 `Map` with Zustand is an anti-pattern when dealing with high-frequency updates (like an SSE log scanner) because returning a new Map object reference on every event causes massive re-render churn and freezes the React UI. Accumulating updates unthrottled amplifies this issue.
**Action:** Always prefer plain JS objects (`Record`) for state manipulation in Zustand, and ensure any incoming high-frequency streams are buffered and flushed to the store with a throttle timer (e.g. 100ms) to preserve main thread interactivity.

## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-05-18 - Throttled SSE Updates and Record vs Map in Zustand State
**Learning:** High-frequency events (like SSE progress updates) combined with ES6 Maps in a Zustand store cause excessive React re-render churn, completely bottlenecking the UI. Zustand isn't natively optimized for deep partial Map updates at high velocity.
**Action:** Always buffer high-frequency stream events and use a throttling interval (e.g., 100ms) to flush batched updates to the state. Additionally, prefer using plain Javascript objects (`Record`) over ES6 `Map`s for React state to ensure efficient partial object spreading and prevent severe UI blocking.

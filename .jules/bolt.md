## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-04-28 - Throttled High-Frequency SSE Updates in Zustand
**Learning:** High-frequency SSE streams (like file scan progress and matches) can cause severe React re-render churn if pushed to a Zustand store unthrottled. Additionally, using ES6 Maps in Zustand state can trigger unnecessary re-renders or complex cloning logic compared to plain JS Objects.
**Action:** Throttle high-frequency state updates using a buffer and a timer (e.g., 100ms `setTimeout`) to batch updates. Prefer plain JavaScript objects (`Record`) over ES6 Maps for Zustand state management to enable efficient partial updates and prevent unnecessary re-renders.

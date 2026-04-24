## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.
## 2024-04-24 - Replaced Map with Plain Object in Zustand State
**Learning:** In React, using an ES6 `Map` inside a Zustand state object causes unnecessary re-renders or requires deep cloning for state updates, making it inefficient for high-frequency updates (e.g., SSE streams updating progress bars).
**Action:** Use plain JavaScript objects (`Record<K, V>`) instead of `Map` in React state managers like Zustand, which allows efficient partial updates via spread syntax and keeps object references stable.

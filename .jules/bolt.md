## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-04-26 - Prevented Unnecessary Renders by Dropping Zustand Maps
**Learning:** For Zustand state management in the React frontend, using ES6 `Map`s for state objects receiving high-frequency updates (like SSE streams from a scanning backend) forces full Map clone operations, adding unnecessary allocations and potentially missing optimized shallow diffs. This causes severe rendering bottlenecks during rapid stream updates.
**Action:** When tracking dynamic but keyed objects (like file stream progress) in Zustand, use plain JavaScript objects (`Record<K, V>`) instead of `Map`. This enables standard object spreading for cleaner, faster partial updates, preventing high-frequency clone overhead.

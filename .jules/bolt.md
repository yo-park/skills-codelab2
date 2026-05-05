## 2024-04-20 - Removed String Allocations From Scanner Hot Path
**Learning:** In the inner loop of `ScanEngine::process_file_stream`, literal keyword searches were allocating string clones and performing `to_lowercase` on both the input string AND every single search keyword for every single line. This O(N * M) allocation overhead on the hot path caused substantial and unnecessary memory pressure.
**Action:** Always verify if keyword pre-computation or case conversions can be hoisted out of a tight IO loop, especially in a fast language like Rust, and avoid mapping or cloning inside hot read loops unless strictly required by mutation semantics.

## 2024-05-18 - Pre-computed Searchable Strings at Ingestion for High-Frequency Filtering
**Learning:** Performing string case conversions like `toLowerCase()` on-the-fly inside a `useMemo` filter block creates unnecessary memory allocations and CPU overhead during React render cycles, especially when dealing with a potentially large and growing list of elements (e.g., streaming server events).
**Action:** When searching or filtering collections containing high-frequency updates, always pre-compute lowercase versions of the searchable fields directly within the data model at the point of ingestion (e.g., adding a `lowered` object inside `MatchEntry`), to shift the allocation cost from render time to ingestion time.

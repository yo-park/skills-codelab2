## 2024-05-08 - Added useDeferredValue to log filter
**Learning:** In a highly reactive log streaming interface, filtering the result array natively on every keystroke blocks the main thread, especially as the number of matches scales up during a live scan.
**Action:** Always use `useDeferredValue` for text inputs that trigger heavy array operations, keeping the input immediately responsive while deferring the expensive compute to a background rendering task.

## 2024-05-10 - Zustand Store Selector Optimization
**Learning:** Destructuring directly from a Zustand hook (e.g., `const { value } = useStore()`) subscribes the component to the entire store, causing unnecessary re-renders on every state change (which is terrible for high-frequency streaming applications like LogAnalyzer).
**Action:** Always use specific state selectors (e.g., `useStore(state => state.value)`) or `shallow` equality with a mapped object selector when pulling multiple values from a Zustand store to prevent wasteful re-renders.

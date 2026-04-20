# LogAnalyzer 🛡️

**LogAnalyzer** is a high-performance, real-time Java log stream scanner designed to handle large-scale log files with minimal memory footprint. It combines the safety and speed of **Rust** in the backend with the reactivity of **React** in the frontend, providing a seamless experience for developers to debug and analyze logs.

> [!NOTE]
> This project was developed, debugged, and verified by the **Gemini 3 Flash** AI agent using the **Antigravity** autonomous coding tool. This ensures a high standard of implementation through the **Autonomous AI Developer Pipelines**.

## 🚀 Key Features

- **Streaming Scan:** Leverages Rust's non-blocking I/O to process gigabytes of log data without full buffering.
- **Real-time Updates:** Uses Server-Sent Events (SSE) to stream match results to the UI as they happen.
- **Sophisticated Search:**
  - Multi-keyword support (one per line).
  - Literal and Regex pattern modes.
  - Case-sensitivity control.
  - **Contextual View:** Define how many lines to display before and after each match to understand the log's context.
- **Modern Dashboard UI:**
  - **Side-by-side Configuration:** Efficient layout for file attachment and keyword entry.
  - **Live Progress Tracking:** Individual progress bars for each scanning file.
  - **Smart Result Table:** Filter, paginate (20/50/100 rows), and scroll through thousands of matches efficiently.
  - **CSV Export:** Download your filtered results for further analysis.
- **Aesthetic Dark Mode:** A premium, eye-friendly interface designed for long debugging sessions.

## 🛠️ Technology Stack

### Backend (Rust)
- **Framework:** [Axum](https://github.com/tokio-rs/axum) (High-performance web framework)
- **Runtime:** [Tokio](https://tokio.rs/) (Asynchronous library)
- **Serialization:** [Serde](https://serde.rs/) (JSON & data transformation)
- **Streaming:** Server-Sent Events (SSE) via `tokio-stream`
- **Architecture:** Concurrent session management using `DashMap` and `broadcast` channels.

### Frontend (React)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** Vanilla CSS (Modern CSS variables & Grid)
- **Icons:** [Lucide-React](https://lucide-react.com/)

## 🏃 Getting Started

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Node.js & npm](https://nodejs.org/)

### 1. Build the Frontend
```bash
cd app_build/frontend
npm install
npm run build
```
This generates the optimized production bundle in `dist/`, which the Rust backend will serve.

### 2. Run the Backend
```bash
cd ../backend
cargo run
```
The server will start at `http://localhost:3000`.

## 📁 Project Structure

```text
├── app_build/
│   ├── backend/          # Rust source code (Axum + Scanning Engine)
│   └── frontend/         # React source code (App + Components)
├── dev/                  # Development resources (Sample logs)
└── production_artifacts/ # Technical specifications and assets
```

## 📋 Usage Guide

1. **Attach Files:** Drag and drop your `.log` files into the File Attach Area.
2. **Configure Keywords:** Enter keywords or regex patterns in the Keywords Area (one per line).
3. **Set Context:** Specify how many lines of context you need for each match.
4. **Scan:** Click **Start** to initiate the streaming scan.
5. **Analyze:** Watch matches appear live, use the filter bar to drill down, and navigate through pages.
6. **Export:** Use **CSV Download** to save your findings.

## 📄 License
This project is licensed under the MIT License.

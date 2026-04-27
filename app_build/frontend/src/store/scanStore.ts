import { create } from 'zustand';
import {
  MatchEntry,
  FileProgress,
  ScanStatus,
  PatternMode,
  ScanConfig,
  ServerMatch,
  ServerProgress,
  ServerFileStart,
  ServerFileDone
} from '../types';

interface ScanState extends ScanConfig {
  files: File[];
  scanId: string | null;
  scanStatus: ScanStatus;
  fileProgress: Record<number, FileProgress>;
  matches: MatchEntry[];
  error: string | null;

  // Actions
  setFiles: (files: File[]) => void;
  setKeywords: (keywords: string) => void;
  setPatternMode: (mode: PatternMode) => void;
  setCaseSensitive: (val: boolean) => void;
  setContextLines: (val: number) => void;
  setConcurrency: (val: number) => void;
  setMaxMatchesPerFile: (val: number) => void;
  setStartTime: (val: string) => void;
  setEndTime: (val: string) => void;

  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  resetScan: () => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
  // Defaults
  files: [],
  keywords: '',
  patternMode: 'literal',
  caseSensitive: false,
  contextLines: 1,
  concurrency: 1,
  maxMatchesPerFile: 100,
  startTime: '',
  endTime: '',

  scanId: null,
  scanStatus: 'idle',
  fileProgress: {},
  matches: [],
  error: null,

  setFiles: (files) => set({ files }),
  setKeywords: (keywords) => set({ keywords }),
  setPatternMode: (patternMode) => set({ patternMode }),
  setCaseSensitive: (caseSensitive) => set({ caseSensitive }),
  setContextLines: (contextLines) => set({ contextLines }),
  setConcurrency: (concurrency) => set({ concurrency }),
  setMaxMatchesPerFile: (maxMatchesPerFile) => set({ maxMatchesPerFile }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),

  resetScan: () => set({
    scanId: null,
    scanStatus: 'idle',
    fileProgress: {},
    matches: [],
    error: null
  }),

  startScan: async () => {
    const { files, keywords, patternMode, caseSensitive, contextLines, concurrency, maxMatchesPerFile, startTime, endTime } = get();

    if (files.length === 0) {
      set({ error: "Please select files to scan." });
      return;
    }
    if (!keywords.trim()) {
      set({ error: "Please enter keywords to search." });
      return;
    }

    set({ scanStatus: 'running', matches: [], fileProgress: {}, error: null });

    const formData = new FormData();
    formData.append('keywords', keywords);
    formData.append('pattern_mode', patternMode);
    formData.append('case_sensitive', String(caseSensitive));
    formData.append('context_lines', String(contextLines));
    formData.append('concurrency', String(concurrency));
    formData.append('max_matches_per_file', String(maxMatchesPerFile));
    if (startTime) formData.append('start_time', startTime);
    if (endTime) formData.append('end_time', endTime);

    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to start scan');

      const { scan_id } = await response.json();
      set({ scanId: scan_id });

      let pendingProgressUpdates: Record<number, Partial<FileProgress>> = {};
      let pendingMatches: MatchEntry[] = [];

      const flush = () => {
        const hasProgress = Object.keys(pendingProgressUpdates).length > 0;
        const hasMatches = pendingMatches.length > 0;

        if (!hasProgress && !hasMatches) return;

        set(state => {
          const newState: Partial<ScanState> = {};

          if (hasProgress) {
            const updatedProgress = { ...state.fileProgress };
            for (const [idxStr, update] of Object.entries(pendingProgressUpdates)) {
              const idx = Number(idxStr);
              updatedProgress[idx] = {
                ...updatedProgress[idx],
                ...update
              } as FileProgress;
            }
            newState.fileProgress = updatedProgress;
          }

          if (hasMatches) {
            newState.matches = [...state.matches, ...pendingMatches];
          }

          return newState;
        });

        pendingProgressUpdates = {};
        pendingMatches = [];
      };

      const flushInterval = setInterval(flush, 100);

      // Start SSE listening
      const eventSource = new EventSource(`/api/events/${scan_id}`);

      eventSource.addEventListener('file_start', (e: any) => {
        const payload = JSON.parse(e.data);
        const data: ServerFileStart = payload.data;
        pendingProgressUpdates[data.file_index] = {
          fileName: data.file_name,
          totalBytes: data.total_bytes,
          bytesRead: 0,
          linesScanned: 0,
          matchesFound: 0,
          status: 'scanning'
        };
      });

      eventSource.addEventListener('progress', (e: any) => {
        const payload = JSON.parse(e.data);
        const data: ServerProgress = payload.data;
        pendingProgressUpdates[data.file_index] = {
          ...(pendingProgressUpdates[data.file_index] || {}),
          bytesRead: data.bytes_read,
          linesScanned: data.lines_scanned,
          matchesFound: data.matches_found
        };
      });

      eventSource.addEventListener('match', (e: any) => {
        const payload = JSON.parse(e.data);
        const data: ServerMatch = payload.data;
        pendingMatches.push({
          id: Math.random().toString(36).substring(2),
          fileIndex: data.file_index,
          fileName: data.file_name,
          lineNumber: data.line_number,
          keyword: data.keyword,
          content: data.content,
          contextBefore: data.context_before || [],
          contextAfter: data.context_after || [],
        });
      });

      eventSource.addEventListener('file_done', (e: any) => {
        const payload = JSON.parse(e.data);
        const data: ServerFileDone = payload.data;
        pendingProgressUpdates[data.file_index] = {
          ...(pendingProgressUpdates[data.file_index] || {}),
          status: 'done'
        };
      });

      eventSource.addEventListener('scan_done', () => {
        clearInterval(flushInterval);
        flush();
        set({ scanStatus: 'done' });
        eventSource.close();
      });

      eventSource.onerror = () => {
        clearInterval(flushInterval);
        flush();
        set({ scanStatus: 'error', error: "Stream connection error" });
        eventSource.close();
      };

    } catch (err: any) {
      set({ scanStatus: 'error', error: err.message });
    }
  },

  stopScan: async () => {
    const { scanId } = get();
    if (!scanId) return;

    try {
      await fetch(`/api/scan/${scanId}/stop`, { method: 'POST' });
      set({ scanStatus: 'stopped' });
    } catch (err) {
      console.error("Stop error:", err);
    }
  }
}));

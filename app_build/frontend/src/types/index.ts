export interface MatchEntry {
  id: string; // client-side unique id
  fileIndex: number;
  fileName: string;
  lineNumber: number;
  keyword: string;
  content: string;
  contextBefore: string[];
  contextAfter: string[];
}

export interface FileProgress {
  fileName: string;
  totalBytes: number;
  bytesRead: number;
  linesScanned: number;
  matchesFound: number;
  status: 'pending' | 'scanning' | 'done' | 'error';
}

export type ScanStatus = 'idle' | 'running' | 'stopped' | 'done' | 'error';
export type PatternMode = 'literal' | 'regex';

export interface ScanConfig {
  keywords: string;
  patternMode: PatternMode;
  caseSensitive: boolean;
  contextLines: number;
  concurrency: number;
  maxMatchesPerFile: number;
  startTime?: string;
  endTime?: string;
}

export interface ServerMatch {
  file_index: number;
  file_name: string;
  line_number: number;
  keyword: string;
  content: string;
  context_before: string[];
  context_after: string[];
}

export interface ServerProgress {
  file_index: number;
  bytes_read: number;
  lines_scanned: number;
  matches_found: number;
}

export interface ServerFileStart {
  file_name: string;
  file_index: number;
  total_bytes: number;
}

export interface ServerFileDone {
  file_index: number;
  total_lines: number;
  total_matches: number;
}

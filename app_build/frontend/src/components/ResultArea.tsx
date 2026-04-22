import React, { useMemo, useState } from 'react';
import { useScanStore } from '../store/scanStore';

const ResultArea: React.FC = () => {
  const { matches } = useScanStore();
  const [filter, setFilter] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMatches = useMemo(() => {
    let result = matches;
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      result = matches.filter(m =>
        m.fileName.toLowerCase().includes(lowerFilter) ||
        m.content.toLowerCase().includes(lowerFilter) ||
        m.keyword.toLowerCase().includes(lowerFilter)
      );
    }
    return result;
  }, [matches, filter]);

  const totalPages = Math.ceil(filteredMatches.length / pageSize);
  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMatches.slice(start, start + pageSize);
  }, [filteredMatches, currentPage, pageSize]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, pageSize]);

  const downloadCSV = () => {
    const headers = ['File', 'Line', 'Keyword', 'Content'];
    const rows = filteredMatches.map(m => [
      m.fileName,
      m.lineNumber,
      m.keyword,
      m.content.replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `log_matches_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build visible page numbers
  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <section className="results-section">
      {/* Toolbar */}
      <div className="results-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <div className="results-filter-wrap">
            <span className="material-symbols-outlined results-filter-icon">filter_alt</span>
            <input
              className="results-filter-input"
              type="text"
              placeholder="Filter by pattern, file, or content..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              id="result-filter-input"
            />
          </div>

          <div className="page-size-wrap">
            <label htmlFor="page-size" style={{ fontSize: '0.75rem' }}>Rows:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <button
          className="outline-btn"
          onClick={downloadCSV}
          disabled={filteredMatches.length === 0}
          id="btn-download-csv"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th style={{ width: 96 }}>Line No</th>
              <th style={{ width: 160 }}>Pattern Match</th>
              <th>Content Fragment</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMatches.map((match) => (
              <tr key={match.id}>
                <td className="cell-filename">{match.fileName}</td>
                <td className="cell-line">{match.lineNumber.toLocaleString()}</td>
                <td>
                  <span className="keyword-badge primary">{match.keyword}</span>
                </td>
                <td>
                  {match.contextBefore.map((line, i) => (
                    <span key={`b-${i}`} className="context-line">{line}</span>
                  ))}
                  <span className="match-line">{match.content}</span>
                  {match.contextAfter.map((line, i) => (
                    <span key={`a-${i}`} className="context-line">{line}</span>
                  ))}
                </td>
              </tr>
            ))}

            {filteredMatches.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--on-surface-variant)' }}>
                  No matches found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="results-footer">
        <p className="results-count">
          Showing {paginatedMatches.length} of {filteredMatches.length} matches
        </p>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
            </button>

            <div className="page-numbers">
              {visiblePages.map(p => (
                <span
                  key={p}
                  className={`page-num ${p === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </span>
              ))}
            </div>

            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultArea;

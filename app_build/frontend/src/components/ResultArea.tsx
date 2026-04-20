import React, { useMemo, useState } from 'react';
import { Table, Download, Filter } from 'lucide-react';
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

  // Reset to page 1 when filter or page size changes
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

  return (
    <section className="card results-area" style={{ flex: 1 }}>
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Table size={18} />
          Result Area ({filteredMatches.length} matches)
        </div>
        <button className="secondary" onClick={downloadCSV} disabled={filteredMatches.length === 0}>
          <Download size={14} />
          CSV Download
        </button>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative', width: '300px' }}>
          <Filter size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Filter results..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', paddingLeft: 32 }}
          />
        </div>
        <div className="pagination-controls" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label htmlFor="page-size" style={{ fontSize: '0.8125rem' }}>Rows per page:</label>
          <select 
            id="page-size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ padding: '4px 8px' }}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '150px' }}>File</th>
              <th style={{ width: '80px' }}>Line</th>
              <th style={{ width: '100px' }}>Keyword</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMatches.map((match) => (
              <tr key={match.id}>
                <td style={{ color: 'var(--text-secondary)' }}>{match.fileName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{match.lineNumber}</td>
                <td className="cell-keyword">{match.keyword}</td>
                <td className="cell-content">
                  {match.contextBefore.map((line, i) => (
                    <div key={`b-${i}`} style={{ opacity: 0.5 }}>{line}</div>
                  ))}
                  <div style={{ color: 'var(--accent)', fontWeight: 500 }}>{match.content}</div>
                  {match.contextAfter.map((line, i) => (
                    <div key={`a-${i}`} style={{ opacity: 0.5 }}>{line}</div>
                  ))}
                </td>
              </tr>
            ))}
            {filteredMatches.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No matches found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 }}>
          <button 
            className="secondary" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{ padding: '4px 12px' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.875rem' }}>Page {currentPage} of {totalPages}</span>
          <button 
            className="secondary" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '4px 12px' }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default ResultArea;

import React, { useState } from 'react';
import './Table.css';
import Input from '../Input/Input';

const Table = ({ 
  columns = [], 
  data = [], 
  searchPlaceholder = "Search records...", 
  searchKey = null, 
  actions = null,
  pageSize = 5
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Search Filter
  const filteredData = data.filter((item) => {
    if (!searchKey || !searchQuery) return true;
    const value = item[searchKey];
    if (!value) return false;
    return String(value).toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 2. Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-component-wrapper">
      {/* Search Header Action Row */}
      {searchKey && (
        <div className="table-search-bar-row">
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on filter
            }}
            icon="🔍"
          />
        </div>
      )}

      {/* Main Table viewport */}
      <div className="table-responsive-viewport">
        <table className="table-element">
          <thead>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={col.sortable ? 'col-sortable-header' : ''}
                  onClick={col.sortable ? () => requestSort(col.key) : undefined}
                >
                  <div className="th-cell-content">
                    {col.title}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="sort-chevron-icon">
                        {sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="col-actions-header">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr key={row.id || rIdx}>
                  {columns.map((col) => (
                    <td key={col.key} data-label={col.title}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="actions-cell" data-label="Actions">
                      <div className="actions-cell-flow">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="table-empty-row-td">
                  🚫 No records found matching the query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (Alternative viewport) */}
      <div className="mobile-table-cards">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, rIdx) => (
            <div key={row.id || rIdx} className="table-mobile-card -card">
              {columns.map((col) => (
                <div key={col.key} className="mobile-card-row">
                  <span className="mobile-card-label">{col.title}</span>
                  <span className="mobile-card-value">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
              {actions && (
                <div className="mobile-card-actions">
                  {actions(row)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="table-mobile-empty">🚫 No records found.</div>
        )}
      </div>

      {/* Pagination Footer Controls */}
      {totalPages > 1 && (
        <footer className="table-pagination-nav">
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          <span className="pagination-count-label">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredData.length} records)
          </span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </footer>
      )}
    </div>
  );
};

export default Table;


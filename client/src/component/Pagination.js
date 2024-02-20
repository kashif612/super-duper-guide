// Pagination.js

import React from 'react';

function Pagination({ currentPage, itemsPerPage, totalItems, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} onClick={() => handleClick(i)}>
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <ul>
        {renderPageNumbers()}
      </ul>
    </div>
  );
}

export default Pagination;

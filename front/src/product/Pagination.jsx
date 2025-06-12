// ✅ 생략 기호를 표시해 컴포넌트화한 리뷰 페이지네이션
import React from 'react';


const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const getPages = () => {
    const pages = [];
    let left = currentPage - 2;
    let right = currentPage + 2;

    if (left < 1) {
      right += 1 - left;
      left = 1;
    }
    if (right > totalPages) {
      left -= right - totalPages;
      right = totalPages;
    }
    if (left < 1) left = 1;

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div style={{ marginTop: '15px', textAlign: 'center' }}>
      {currentPage > 1 && (
        <button onClick={() => setCurrentPage(1)} style={btnStyle}>처음</button>
      )}

      {currentPage > 5 && (
        <button onClick={() => setCurrentPage(Math.max(currentPage - 5, 1))} style={btnStyle}>◀</button>
      )}

      {pages[0] > 1 && <span style={ellipsisStyle}>...</span>}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          style={
            page === currentPage
              ? { ...btnStyle, borderBottom: '2px solid black', fontWeight: 'bold' }
              : btnStyle
          }
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && <span style={ellipsisStyle}>...</span>}

      {currentPage + 5 <= totalPages && (
        <button onClick={() => setCurrentPage(Math.min(currentPage + 5, totalPages))} style={btnStyle}>▶</button>
      )}

      {currentPage < totalPages && (
        <button onClick={() => setCurrentPage(totalPages)} style={btnStyle}>끝</button>
      )}
    </div>
  );
};

const btnStyle = {
  margin: '0 6px',
  padding: '5px 10px',
  background: 'none',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  borderBottom:'none'
};

const ellipsisStyle = {
  margin: '0 4px',
  fontSize: '16px' 
};

export default Pagination;
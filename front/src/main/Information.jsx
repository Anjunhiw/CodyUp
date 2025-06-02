// src/main/Information.jsx
import React from 'react';
import './Information.css'; 


function Information() {
  return (
    <footer className="f1">
      <div className="p1">
        <button>이용약관</button>
        <button>개인정보처리방침</button>
        <button>위치정보 이용약관</button>
        <button>법적고지</button>
      </div>
      <div className="info">
        <p>경기도 화성시 병점동 병점3로 12</p>
        <p>사업자등록번호: 123-45-67890</p> 
        <p>대표이사 : ???</p> 
        <p>고객센터: 031-123-4567</p>
        <p>© CodyUp Co., All rights reserved.</p>
      </div>
    </footer>
  );
}


export default Information;
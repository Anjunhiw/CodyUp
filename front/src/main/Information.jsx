// src/main/Information.jsx
import React from 'react';
import './Information.css'; 
import { useNavigate } from 'react-router-dom';


function Information() {

  const navigate = useNavigate();

  const goTerms = () => navigate('/Terms');
  const goProcessPolicy = () => navigate('/ProcessPolicy');
  const goToLocationPolicy = () => navigate('/LocationPolicy');
  const goToLegalNotice = () => navigate('/LegalNotice');

  return (
    <footer className="f1">
      <div className="p1">
        <button onClick={goTerms}>이용약관</button>
        <button onClick={goProcessPolicy}>개인정보처리방침</button>
        <button onClick={goToLocationPolicy}>위치정보 이용약관</button>
        <button onClick={goToLegalNotice}>법적고지</button>
      </div>
      <div className="info">
        <p>경기도 화성시 병점동 병점3로 12</p>
        <p>사업자등록번호: 123-45-67890</p> 
        <p>대표이사 : 안준휘, 김세은, 김민수</p> 
        <p>고객센터: 031-123-4567</p>
        <p>© CodyUp Co., All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Information;
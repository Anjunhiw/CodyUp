import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './updatePassword.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function UpdatePassword({ userId }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [message, setMessage] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const navigate = useNavigate();
  const handleUpdate = () => {
    if (!currentPw || !newPw) {
      setMessage('모든 항목을 입력하세요.');
      return;
    }

    axios.patch('http://192.168.0.20:8080/mypage/update-password', {
      user_id: userId,
      current_password: currentPw,
      new_password: newPw
    })
    .then(res => {
      if (res.data.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/mypage/userInfo');
      } else {
        setMessage(` ${res.data.message}`);
      }
    })
    .catch(err => {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message || '오류 발생';
             if (status === 401) {
                setMessage(` 기존 비밀번호가 일치하지 않습니다.`);
            } else if (status === 404) {
                setMessage(` 해당 사용자를 찾을 수 없습니다.`);
            } else {
            setMessage(`❌ ${msg}`);
            }
            } else {
            setMessage('❌ 서버 연결 오류');
            }

        console.error(err);
    });
  };

  return (
    <div className="update-password">
        <div>
            <h1>비밀번호 변경</h1>
        </div>
        <div>
            <input
            className='.update_inp'
            type={showCurrent ? "text" : "password"}
            placeholder="기존 비밀번호"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowCurrent(!showCurrent)}>
            <FontAwesomeIcon className="icon" icon= {showCurrent ? faEyeSlash : faEye}></FontAwesomeIcon>
            </span>

        </div>
        <div>
            <input
            className='.update_inp'
            type={showNew ? "text" : "password"}
            placeholder="새 비밀번호"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
            <FontAwesomeIcon className="icon" icon= {showNew ? faEyeSlash : faEye}></FontAwesomeIcon>
            </span>
        </div>
        <div>
            <button className='cor_btn' onClick={handleUpdate}>변경</button>
            {message && <p>{message}</p>} 
        </div>
      
    </div>
  );
}

export default UpdatePassword;
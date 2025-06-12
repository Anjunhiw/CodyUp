import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './Find.css'
import './user.css'

const Pw = () => {

  //로그인 화면 이동 경로
   const navigate = useNavigate();
       function goToLogin() {
          navigate("/Login");
      }
      const [id, setId] = useState('');
      const [name, setName] = useState('');

      //비밀번호 조회 버튼 이벤트
      async function handleFindpw(event){
        event.preventDefault();

        if(name==="" || id===""){
          alert("이름 또는 아이디를 입력하세요");
          return;
        }
        try{
          const response = await fetch('http://192.168.0.20:8080/find/find-password',{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
              user_name: name,
              user_id: id
            })
          })
          const data = await response.json();
          if(data.success){
            //console.log(data);
            alert(`임시 비밀번호가 발급되었습니다: ${data.temp_password}`);
          } else{
            alert("일치하는 회원이 없습니다");
          }
      }
      catch(error) {
        console.error("에러발생:", error);
        alert("서버 오류가 발생했습니다");
      };
    }
  return (
    <div className='Pw_page'>
      <div className='title2'>비밀번호 찾기</div>
      <div className='name_title'>이름</div>
      <div>
        <input className='inp' placeholder='이름' value={name} onChange={(e)=>setName(e.target.value)}></input>
      </div>
      <div className='login_title'>아이디</div>
      <div>
        <input className='inp' placeholder='아이디' value={id} onChange={(e)=>setId(e.target.value)}></input>
      </div>
      <div>
        <button className='lookup' onClick={handleFindpw}>비밀번호 조회</button>
      </div>
      <div>
          <button className="back_btn2" onClick={goToLogin}>로그인 화면 이동</button>
      </div>
    </div>
  )
}

export default Pw
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './Find.css'
import './user.css'

const Id = () => {

    //로그인 화면 이동 경로
    const navigate = useNavigate();
     function goToLogin() {
        navigate("/Login");
    }
    const [name, setName] = useState('');
    const [ phone, setPhone] = useState('');

    //전화번호는 숫자만
    const phoneRegex = /^[0-9]+$/;
    
    //아이디 조회 버튼 이벤트
    async function handleFindid(event){
         event.preventDefault();
    
        if(name==="" || phone===""){
            alert("이름 또는 전화번호를 입력하세요");
            return;
        } if(!phoneRegex.test(phone)){
            alert("전화번호는 숫자만 입력해주세요");
            return;
        }
        try{
        const response = await fetch('http://192.168.0.20:8080/find/find-id',{
         method: "POST",
         headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
        user_name: name,
        user_phone_number: phone
      })
         });
          const data = await response.json();
            if (data.success) {
                alert(`당신의 아이디는 ${data.user_id} 입니다`);
                //navigate("/home"); // 로그인 후 이동할 페이지가 있다면
            } else {
                alert("일치하는 회원이 없습니다");
            }
        }
            catch(error) {
            console.error("에러 발생:", error);
            alert("서버 오류가 발생했습니다");
            };
    }
  return (
    <div className='Id_page'>
        <div className='title2'>아이디 찾기</div>
        <div className='name_title'>이름</div>
        <div>
            <input className='inp'placeholder='이름' value={name} onChange={(e)=>setName(e.target.value)}></input>
        </div>
        <div className='phone_title'>전화번호 (-제외)</div>
        <div>
            <input className='inp' placeholder='01012341234' value={phone} onChange={(e)=>setPhone(e.target.value)}></input>
        </div>
        <div>
            <button className='lookup' onClick={handleFindid}>아이디 조회</button>
        </div>
        <div>
        <button className="back_btn2" onClick={goToLogin}>로그인 화면 이동</button>
        </div>
      
    </div>
  )
}

export default Id

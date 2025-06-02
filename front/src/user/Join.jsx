import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";//비번 눈 아이콘 불러오기
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Join = () => {
  const [id, setId] = useState("");
  const [idMessage, setIdMessage] = useState("");       //  아이디 메시지
  const [idValid, setIdValid] = useState(false);        //  아이디 유효 여부

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const[pwMessage, setPwMessage] = useState("");
  const[pwValid, setPwValid] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneMessage, setPhoneMessage] = useState(""); //  폰 메시지
  const [phoneValid, setPhoneValid] = useState(false);//  폰 유효 여부

  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwConfirmMessage, setPwConfirmMessage] = useState("");
  const [pwConfirmValid, setPwConfirmValid] = useState(false);


  const phoneRegex = /^010\d{8}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).{7,}$/;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  //  아이디 중복 검사 (onBlur)
  const checkId = async () => {
    if (!id) {
      setIdMessage("아이디를 입력해주세요");
      setIdValid(false);
      return;
    }

    const res = await fetch("http://192.168.0.20:8080/check/id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: id })
    });
    const data = await res.json();
    console.log(data.success);
    if (data.success) {
       setIdMessage(data.message);
      setIdValid(true);
    } else {
      setIdMessage(data.message);
      setIdValid(false);
    }
  };

  //  휴대폰 중복 검사 (onBlur)
  const checkPhone = async () => {
    if (!phoneRegex.test(phone)) {
      setPhoneMessage("전화번호는 010으로 시작하는 11자리 숫자만 입력해주세요");
      setPhoneValid(false);
      return;
    }

    const res = await fetch("http://192.168.0.20:8080/check/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_phone_number: phone })
    });
    const data = await res.json();

    if (data.success) {
      setPhoneMessage("사용 가능한 전화번호입니다");
      setPhoneValid(true);
    } else {
      setPhoneMessage(data.message);
      setPhoneValid(false);
    }
  };

  const handleJoin = async () => {
    if (!idValid) {
      alert("아이디 중복 확인이 필요합니다");
      return;
    }
    if (!phoneValid) {
      alert("휴대폰 번호 중복 확인이 필요합니다");
      return;
    }
    if(!pwConfirmValid){
      alert("비밀번호 확인이 일치하지 않습니다");
      return;
    }
    if (!name) {
      alert("이름을 입력하세요");
      return;
    }

    const res = await fetch("http://192.168.0.20:8080/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: id,
        user_password: password,
        user_name: name,
        user_phone_number: phone,
      })
    });
    const data = await res.json();

    if (data.success) {
      alert("회원가입이 완료되었습니다!");
      navigate("/Login");
    } else {
      alert("회원가입 실패: " + (data.message || "서버 오류"));
    }
  };

  return (
    <div className="join_page">
      <div className="title">회원가입 정보를 입력해주세요</div>

      <div className="login_title">아이디</div>
      <input
        className="inp"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onBlur={checkId}
      />
      <div className={idValid ? "id_valid" : "id_error"}>{idMessage}</div> {/* ✅ 메시지 출력 */}

      <div className="join_title">비밀번호</div>
      <input
        className="inp"
        type={showPassword ? "text" : "password"}
        placeholder="영문자, 숫자, 특수문자 포함 8자 이상"
        value={password}
        onChange={(e) => {
          const inputPw = e.target.value;
          setPassword(inputPw);

          if (!passwordRegex.test(inputPw)) {
      setPwMessage("영문자, 숫자, 특수문자 포함 8자 이상이어야 합니다");
      setPwValid(false);
      return;
    }else{
      setPwMessage("");//조건 만족하면 메시지 제거
      setPwValid(true);
    }   // 비밀번호 변경 시 확인도 자동 비교
    if (confirmPassword) {
      if (inputPw === confirmPassword) {
        setPwConfirmMessage("비밀번호가 일치합니다");
        setPwConfirmValid(true);
      } else {
        setPwConfirmMessage("비밀번호가 일치하지 않습니다");
        setPwConfirmValid(false);
      }
        
        }}}
      />
      <input className="inp" 
      type={showPassword ? "text" : "password"} 
      placeholder="비밀번호 확인" value={confirmPassword}
      onChange={(e)=>{
        setConfirmPassword(e.target.value);
        if(e.target.value === password){
          setPwConfirmMessage("비밀번호가 일치합니다");
          setPwConfirmValid(true);
        } else{
          setPwConfirmMessage("비밀번호가 일치하지 않습니다");
          setPwConfirmValid(false);
        }
      }}
      />
        <div className={pwConfirmValid ? "pw_valid" : "pw_error"}>{pwConfirmMessage}</div>
        <button type="button" onClick={()=>setShowPassword(!showPassword)} className="join_toggle" tabIndex={-1}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}></FontAwesomeIcon>
        </button>
        {pwMessage &&(
            <div className={pwValid ? "pw_valid" : "pw_error"}>{pwMessage}</div>
        )}
      <div className="name_title">이름</div>
      <input
        className="inp"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="phone_title">전화번호(-제외)</div>
      <input
        className="inp"
        placeholder="01012341234"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={checkPhone}
      />
      <div className={phoneValid ? "phone_valid" : "phone_error"}>{phoneMessage}</div> {/* ✅ 메시지 출력 */}

      <div className="btn">
        <button className="join_btn2" onClick={handleJoin}>가입하기</button>
        <button className="back_btn" onClick={() => navigate("/Login")}>로그인 화면 이동</button>
      </div>
    </div>
  );
};

export default Join;

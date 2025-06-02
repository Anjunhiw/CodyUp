import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login({setIsLoggedIn}) {

    const navigate = useNavigate();
    function goToJoin() {
        navigate("/Join");
    }
    function goToId() {
        navigate("/Id");
    }
    function goToPw() {
        navigate("/Pw");
    }
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


async function handleLogin(event) {
  event.preventDefault();

  if (!id || !password) return alert("아이디와 비밀번호를 입력하세요.");
  if (password.length < 8) return alert("비밀번호는 8자 이상이어야 합니다");

  try {
    const response = await fetch("http://192.168.0.20:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: id, user_password: password }),
    });

    // 이 줄에서 브라우저 콘솔에 로그가 찍히는 걸 막고 싶을 경우
    if (response.status === 401) {
      const errMsg = (await response.json()).message;
      alert(errMsg || "아이디 또는 비밀번호가 틀립니다.");
      return;
    }

    if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

    const data = await response.json();
    alert("로그인 성공!");
    setIsLoggedIn(true);
    sessionStorage.setItem("user_id", id);
    sessionStorage.setItem("is_admin", data.user.is_admin);
    navigate(data.user.is_admin === 1 ? "/Admin" : "/");
  } catch (err) {
    console.error("에러 발생:", err.message);
    alert(err.message || "서버 오류가 발생했습니다.");
  }
}

   return (
        <div className="login_page">
            <div className="title">아이디와 비밀번호를 입력해주세요</div>

            <div className="login_title">아이디</div>
            <div>
                <input
                    className="inp"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                ></input>
            </div>

            <div className="join_title">비밀번호</div>
            <div className="pw_input">
                <input
                    className="inp"
                    placeholder="영문자, 숫자, 특수문자 포함 8자 이상"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <button type="button" onClick={()=>setShowPassword(!showPassword)}className="login_toggle" tabIndex={-1}>
               <FontAwesomeIcon icon= {showPassword ? faEyeSlash : faEye}></FontAwesomeIcon>
                </button>
            </div>

            <div className="btn">
                <button className="login_btn" onClick={handleLogin}>
                    로그인
                </button>
                <div className="line">
                    <span>또는</span>
                </div>
                <button className="find_id" onClick={goToId}>아이디 찾기</button>
                <button className="find_pw" onClick={goToPw}>비밀번호 찾기</button>

                <button className="join_btn" onClick={goToJoin}>
                    회원가입
                </button>
            </div>
        </div>
    );
}
export default Login;

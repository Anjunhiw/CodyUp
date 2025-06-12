import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './userInfo.css'
import MyOrders from './MyOrders';

function UserInfo({ myuserId }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
  
  const updatePassword = () => {
    navigate('/mypage/updatePassword');
  }

  const cartPage = () => {
    navigate('/mypage/cart');
  }

  const WishPage = () => {
    navigate('/mypage/wishlist');
  }

  const MyOrders = () => {
    navigate('/mypage/myorder');
  }

  useEffect(() => {
    if (!myuserId) return;

    axios.post('http://192.168.0.20:8080/mypage/userinfo', { user_id: myuserId })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setError('사용자 정보를 불러오지 못했습니다.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('서버 오류가 발생했습니다.');
      });
  }, [myuserId]);

  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="user_info">
        <h1>마이페이지</h1>
        <h2>내 정보</h2>
        <p><strong>이름:</strong> {user.user_name}</p>  
        <p><strong>아이디:</strong> {user.user_id}</p>
        <p><button onClick={updatePassword} className ='mypage_btn'>비밀번호 변경</button> </p>
        <p><button onClick={cartPage} className ='mypage_btn'>장바구니</button> </p>
        <p><button onClick={WishPage} className ='mypage_btn'>찜목록</button> </p>
        <p><button onClick={MyOrders} className ='mypage_btn'>내 주문내역</button> </p>
    </div>
  );
}

export default UserInfo;
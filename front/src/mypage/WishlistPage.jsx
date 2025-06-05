import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WishlistPage.css';

function WishlistPage({ userId }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.0.20:8080/mypage/wishlist/${userId}`)
      .then(res => {
        if (res.data.success) {
          setWishlist(res.data.wishlist);
          console.log(wishlist);
        }
      })
      .catch(err => console.error("찜목록 조회 오류", err));
  }, [userId]);

  const handleDelete = (item_origin_id) => {
    if (!window.confirm('이 상품을 찜목록에서 삭제하시겠습니까?')) return;

    axios.delete('http://192.168.0.20:8080/mypage/wishlist', {
      data: {
        user_id: userId,
        item_origin_id: item_origin_id
      }
    })
    .then(res => {
      if (res.data.success) {
        // 상태에서 해당 항목 제거
        setWishlist(prev => prev.filter(item => item.item_origin_id !== item_origin_id));
      } else {
        alert(res.data.message);
      }
    })
    .catch(err => {
      console.error("찜 삭제 실패:", err);
      alert("찜 삭제 중 오류 발생");
    });
  };
  return (
    <div>
      <h2>찜한 상품 목록</h2>
      {wishlist.length === 0 ? (
        <p>찜한 상품이 없습니다.</p>
      ) : (
        <ul>
          {wishlist.map(item => (
            <li key={item.item_origin_id}>
              <img src={`http://192.168.0.20:8080/${item.item_img}`} alt={item.item_name} width="100" />
              <div>{item.item_name}</div>
              <div>{item.item_price.toLocaleString()}원</div>
              <button onClick={() => handleDelete(item.item_origin_id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WishlistPage;
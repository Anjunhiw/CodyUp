import { useEffect, useState } from 'react';
import axios from 'axios';
import './WishButton.css'

function WishButton({ itemId }) {
  const [isWished, setIsWished] = useState(false);
  const userId = sessionStorage.getItem('user_id');

   useEffect(() => {
    if (!userId) return;

    axios.get(`http://192.168.0.20:8080/mypage/wishlist/${userId}`)
      .then(res => {
        if (res.data.success) {
          const found = res.data.wishlist.find(item => item.item_origin_id === parseInt(itemId));
          setIsWished(!!found);
        }
      });
  }, [itemId, userId]);

  const handleWishToggle = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!isWished) {
      // 찜 등록
      axios.post('http://192.168.0.20:8080/mypage/wishlist', {
        user_id: userId,
        item_origin_id: itemId
      })
      .then(res => {
        if (res.data.success) {
          setIsWished(true);
          alert("찜 등록 완료!");
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.error("찜 등록 실패:", err);
        alert("찜 등록 중 오류 발생");
      });
    } else {
      // 찜 해제
      axios.delete('http://192.168.0.20:8080/mypage/wishlist', {
        data: { user_id: userId, item_origin_id: itemId }
      })
      .then(res => {
        if (res.data.success) {
          setIsWished(false);
          alert("찜 해제 완료");
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.error("찜 해제 실패:", err);
        alert("찜 해제 중 오류 발생");
      });
    }
  };
  
  return (
    <button onClick={handleWishToggle} className='wish_button'>
      {isWished ? '❤️ 찜함' : '🤍 찜하기'}
    </button>
  );
}

export default WishButton;

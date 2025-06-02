import { useEffect, useState } from 'react';
import axios from 'axios';
import './WishButton.css'

function WishButton({ itemId }) {
  const [isWished, setIsWished] = useState(false);
  const userId = sessionStorage.getItem('user_id');

  // 테스트용 localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWished(wishlist.includes(itemId));
  }, [itemId]);

  const toggleWish = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(itemId)) {
      const updated = wishlist.filter(id => id !== itemId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsWished(false);
    } else {
      wishlist.push(itemId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWished(true);
    }
  };

  /*
  // 연동용
  useEffect(() => {
    axios.get(`/wishlist/${userId}`).then(res => {
      setIsWished(res.data.includes(itemId));
    });
  }, [itemId]);

  const toggleWish = () => {
    const url = `/wishlist`;
    const data = { user_id: userId, item_id: itemId };
    if (isWished) {
      axios.delete(url, { data }).then(() => setIsWished(false));
    } else {
      axios.post(url, data).then(() => setIsWished(true));
    }
  };
  */

  return (
    <button onClick={toggleWish} className='wish_button'>
      {isWished ? '❤️ 찜함' : '🤍 찜하기'}
    </button>
  );
}

export default WishButton;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WishlistPage.css';

function WishlistPage({ userId }) {
  const [wishlist, setWishlist] = useState([]);
  const [sortOption, setSortOption] = useState('recent'); // 'recent' | 'price'

  useEffect(() => {
    axios.get(`http://192.168.0.20:8080/mypage/wishlist/${userId}`)
      .then(res => {
        if (res.data.success) {
          setWishlist(res.data.wishlist);
          console.log(res.data.wishlist);
        }
      })
      .catch(err => console.error('찜 목록 조회 오류', err));
  }, [userId]);

  const handleDelete = (item_origin_id) => {
    if (!window.confirm('이 상품을 찜목록에서 삭제하시겠습니까?')) return;

    axios.delete('http://192.168.0.20:8080/mypage/wishlist', {
      data: { user_id: userId, item_origin_id }
    })
      .then(res => {
        if (res.data.success) {
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

  const handleSortChange = (e) => setSortOption(e.target.value);
  const goToProductPage = (id) => window.location.href = `/item/${id}`;

  const sortedWishlist = wishlist.sort((a, b) => {
    if (sortOption === 'price') return a.item_price - b.item_price;
    return new Date(b.added_at) - new Date(a.added_at);
  });

  return (
    <div className="wishlist-container">
      <h2>찜한 상품 목록</h2>

      <div className="wishlist-controls">
        <label>
          정렬:
          <select value={sortOption} onChange={handleSortChange}>
            <option value="recent">최신순</option>
            <option value="price">가격순</option>
          </select>
        </label>
      </div>

      {sortedWishlist.length === 0 ? (
        <p>찜한 상품이 없습니다.</p>
      ) : (
        <div className="wishlist-grid">
          {sortedWishlist.map(item => (
            <div className="wishlist-card" key={item.item_origin_id}>
              <img
                className="wishlist-img"
                src={`http://192.168.0.20:8080/${item.item_img}`}
                alt={item.item_name}
                onClick={() => goToProductPage(item.item_origin_id)}
              />
              <div className="wishlist-info">
                <h4 onClick={() => goToProductPage(item.item_origin_id)}>{item.item_name}</h4>
                <p>{
                item.discount_rate > 0 ? item.discount_price.toLocaleString() : item.item_price.toLocaleString()}원
                </p>
                <p>찜한 날짜: {item.added_at ? new Date(item.added_at).toLocaleString() : '날짜 없음'}</p>
                <button className='wishist_button' onClick={() => handleDelete(item.item_origin_id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
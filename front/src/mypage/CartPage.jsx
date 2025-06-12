import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CartPage.css';

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://192.168.0.20:8080/mypage/cart/${userId}`)
      .then(res => {
        if (res.data.success) {
          setCartItems(res.data.cart);
          console.log(res.data.cart);
        } else {
          setMessage('장바구니 불러오기 실패');
        }
      })
      .catch(err => {
        console.error(err);
        setMessage('서버 오류');
      });
  }, [userId]);

  const handleQuantityChange = (cartId, newQty) => {
    axios.patch(`http://192.168.0.20:8080/mypage/cart/${cartId}`, {
      quantity: newQty
    }).then(() => {
      setCartItems(prev =>
        prev.map(item => {
          const option = JSON.parse(item.cart_option || '{}');
          if (item.cart_id === cartId) {
            return {
              ...item,
              cart_option: JSON.stringify({ ...option, quantity: newQty })
            };
          }
          return item;
        })
      );
    }).catch(err => console.error('수량 수정 오류', err));
  };

  const handleDelete = (cartId) => {
    axios.delete(`http://192.168.0.20:8080/mypage/cart/${cartId}`)
      .then(() => {
        setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
      })
      .catch(err => console.error('삭제 오류', err));
  };

  const handleCheckboxChange = (cartId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(cartId)
        ? prevSelected.filter(id => id !== cartId)
        : [...prevSelected, cartId]
    );
  };

  const handleOrder = async () => {
    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택하세요.');
      return;
    }

    const selectedCartData = cartItems
      .filter(item => selectedItems.includes(item.cart_id))
      .map(item => {
        const option = JSON.parse(item.cart_option || '{}');
        return {
          cart_id: item.cart_id,
          item_origin_id: item.item_origin_id,
          quantity: option.quantity || 1,
          color: option.color || '',
          size: option.size || ''
        };
      });

    try {
      const res = await axios.post('http://192.168.0.20:8080/mypage/cart/order', {
        user_id: userId,
        order_items: selectedCartData
      });

      if (res.data.success) {
        alert('주문이 완료되었습니다.');
        const refreshed = await axios.get(`http://192.168.0.20:8080/mypage/cart/${userId}`);
        if (refreshed.data.success) {
          setCartItems(refreshed.data.cart);
          setSelectedItems([]);
        }
      } else {
        alert('주문 실패: ' + res.data.message);
      }
    } catch (err) {
      console.error('주문 오류:', err);
      alert('주문 처리 중 오류 발생');
    }
  };

  

  const getKoreanDateWithDayNDaysLater = (n) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date();
    date.setDate(date.getDate() + n);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
  };

  return (
    <div className="cart-page">
      <h2>장바구니</h2>
      {message && <p>{message}</p>}
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map(item => {
            const option = JSON.parse(item.cart_option || '{}');
            const unitPrice = item.discount_rate > 0 ? item.discount_price : item.item_price ;
            const quantity = option.quantity || 1;
            const total = unitPrice * quantity;

            return (
              <div className="cart-item" key={item.cart_id}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.cart_id)}
                  onChange={() => handleCheckboxChange(item.cart_id)}
                />
                <img
                  src={`http://192.168.0.20:8080/${item.item_img}`}
                  alt={item.item_name}
                  className="cart-item-image"
                />

                <div className="cart-item-info" style={{textAlign:'left', marginLeft:'15%'}}>
                  <div className="item-name">{item.item_name}</div>
                  <div className="item-option">{option.color} / {option.size}</div>
                  <div className="item-price">{total.toLocaleString()}원</div>
                  <div>{getKoreanDateWithDayNDaysLater(2)} 도착 예정</div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.cart_id, Math.max(1, quantity - 1))}
                    >−</button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.cart_id, quantity + 1)}
                    >+</button>
                </div>

                  <button onClick={() => handleDelete(item.cart_id)} className="delete-button">
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={handleOrder} className="order-button">선택 항목 주문하기</button>
    </div>
  );
}

export default CartPage;
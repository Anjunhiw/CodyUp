import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CartPage.css';

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // 장바구니 조회
  useEffect(() => {
    if (!userId) return;

    axios.get(`http://192.168.0.20:8080/mypage/cart/${userId}`)
      .then(res => {
        if (res.data.success) {
          setCartItems(res.data.cart);
        } else {
          setMessage('장바구니 불러오기 실패');
        }
      })
      .catch(err => {
        console.error(err);
        setMessage('서버 오류');
      });
  }, [userId]);

  // 수량 변경
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

  // 삭제
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
    //console.log("🛒 선택된 cartItems 원본:", cartItems.filter(item => selectedItems.includes(item.cart_id)));
    const selectedCartData = cartItems
    .filter(item => selectedItems.includes(item.cart_id))
    .map(item => ({
      cart_id: item.cart_id,
      item_origin_id: item.item_origin_id,
      quantity: JSON.parse(item.cart_option || '{}').quantity || 1,
      color: JSON.parse(item.cart_option || '{}').color || '',
      size: JSON.parse(item.cart_option || '{}').size || ''
    }));
    /*
    console.log("✅ 보낼 주문 데이터:", {
      user_id: userId,
      order_items: selectedCartData
    });
    */
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

  return (
    <div className="cart-page">
      <h2>장바구니</h2>
      {message && <p>{message}</p>}
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>상품명</th>
              <th>옵션</th>
              <th>가격</th>
              <th>수량</th>
              <th>합계</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => {
              const option = JSON.parse(item.cart_option || '{}');
              const unitPrice = item.item_price || 0;
              const quantity = option.quantity || 1;
              const total = unitPrice * quantity;

              return (
                <tr key={item.cart_id}>
                  <td>
                    <input
                    type="checkbox"
                    checked={selectedItems.includes(item.cart_id)}
                    onChange={() => handleCheckboxChange(item.cart_id)}
                    />
                  </td>
                  <td>{item.item_name}</td>
                  <td>{option.color} / {option.size}</td>
                  <td>{unitPrice.toLocaleString()}원</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.cart_id, parseInt(e.target.value, 10))
                      }
                    />
                  </td>
                  <td>{total.toLocaleString()}원</td>
                  <td>
                    <button onClick={() => handleDelete(item.cart_id)}>삭제</button>
                  </td>
                </tr>
                
              );
            })}
          </tbody>
          
        </table>
        
      )}
      <button onClick={handleOrder} className="order-button">선택 항목 주문하기</button>
    </div>
  );
}

export default CartPage;

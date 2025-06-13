import { useState, useEffect } from 'react';
import axios from 'axios';
import './CartButton.css';

function CartButton({ item, selectedColor, selectedSize, selectedAmount, disabled }) {
  const [inCart, setInCart] = useState(false);
  const userId = sessionStorage.getItem('user_id');

  useEffect(() => {
    if (!userId || !item?.item_origin_id) return;
    setInCart(false);
  }, [item]);

  const handleAddToCart = () => {
    if (!userId || !selectedColor || !selectedSize || selectedAmount <= 0) {
      alert('옵션을 모두 선택하세요.');
      return;
    }

    const cartOption = JSON.stringify({
      color: selectedColor,
      size: selectedSize,
      quantity: selectedAmount
    });

    axios.post('http://192.168.0.20:8080/mypage/cart/add', {
      user_id: userId,
      item_origin_id: item.item_origin_id,
       cart_option: {
        color: selectedColor,
        size: selectedSize,
        quantity: selectedAmount
      }
      //price: item.item_price  //  개당 가격
    })
    .then(res => {
      if (res.data.success) {
        alert(res.data.message);
        setInCart(true);
      } else {
        alert(`❌ ${res.data.message}`);
      }
    })
    .catch(err => {
      console.error('장바구니 추가 실패:', err);
      alert('서버 오류로 장바구니 추가에 실패했습니다.');
    });
  };

  return (
    <button 
    onClick={handleAddToCart} 
    className='cart-button'
    disabled={disabled}
    >
     ➕ 장바구니
    </button>
  );
}

export default CartButton;

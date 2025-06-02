import { useState, useEffect } from 'react';
import axios from 'axios';
import './CartButton.css'

function CartButton({ item }) {
  const [inCart, setInCart] = useState(false);
  const userId = sessionStorage.getItem('user_id');

  // 테스트용 localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setInCart(cart.some(i => i.item_id === item.item_id));
  }, [item]);

  const toggleCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.some(i => i.item_id === item.item_id)) {
      const updated = cart.filter(i => i.item_id !== item.item_id);
      localStorage.setItem('cart', JSON.stringify(updated));
      setInCart(false);
    } else {
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      setInCart(true);
    }
  };

  /*
  // 연동용
  useEffect(() => {
    axios.get(`/cart/${userId}`).then(res => {
      setInCart(res.data.some(i => i.item_id === item.item_id));
    });
  }, [item]);

  const toggleCart = () => {
    const url = `/cart`;
    const data = { user_id: userId, item_id: item.item_id };
    if (inCart) {
      axios.delete(url, { data }).then(() => setInCart(false));
    } else {
      axios.post(url, data).then(() => setInCart(true));
    }
  };
  */

  return (
    <button onClick={toggleCart} className='cart-button'>
      {inCart ? '🛒 담김' : '➕ 장바구니'}
    </button>
  );
}

export default CartButton;

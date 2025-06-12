import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discount_List.css'; // 선택사항

function Discount_List() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [discountRate, setDiscountRate] = useState('');
  const [discountItems, setDiscountItems] = useState([]);

    const fetchAllItems = async () => {
    try {
        const res = await axios.get('http://192.168.0.20:8080/admin/all-items');
        setItems(res.data); // setItems는 select 박스용
    } catch (err) {
        console.error('전체 상품 목록 불러오기 오류:', err);
    }
    };


  // 할인 상품 목록 조회
  const fetchDiscountedItems = async () => {
    try {
        const res = await axios.get('http://192.168.0.20:8080/admin/discount');
        setDiscountItems(res.data); // 할인 리스트 출력용
  } catch (err) {
    console.error('할인 상품 불러오기 오류:', err);
  }
};

  // 할인 등록
  const handleDiscountSubmit = async () => {
    if (!selectedItemId || !discountRate) {
      alert('상품과 할인률을 선택해주세요.');
      return;
    }

    try {
      await axios.patch('http://192.168.0.20:8080/admin/discount/apply', {
        item_origin_id: selectedItemId,
        discount_rate: Number(discountRate)
      });

      alert('해당 상품이 ' + discountRate + '% 할인되었습니다.');
      setDiscountRate('');
      setSelectedItemId(null);
      fetchDiscountedItems();
    } catch (err) {
      console.error('할인 등록 오류:', err);
      alert('할인 등록 실패');
    }
  };

  // 할인 초기화
  const handleReset = async () => {
    try {
      await axios.patch('http://192.168.0.20:8080/admin/reset');
      alert('모든 상품의 할인 정보가 초기화되었습니다.');
      fetchDiscountedItems();
    } catch (err) {
      console.error('초기화 오류:', err);
    }
  };

  useEffect(() => {
    fetchDiscountedItems();
    fetchAllItems();         // 드롭다운용 전체 상품

  }, []);

  return (
    <div className="discount-list">
      <h2>할인 상품 관리</h2>

      <div className="discount-form">
        <select value={selectedItemId || ''} onChange={(e) => setSelectedItemId(e.target.value)}>
          <option value="">상품 선택</option>
          {items.map(item => (
            <option key={item.item_origin_id} value={item.item_origin_id}>
              {item.item_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          max="95"
          step="5"
          placeholder="할인률 (%)"
          value={discountRate}
          onChange={(e) => setDiscountRate(e.target.value)}
          onKeyDown={(e) => e.preventDefault()}
        />
        <button onClick={handleDiscountSubmit}>할인 등록</button>
        <button onClick={handleReset}>할인 초기화</button>
      </div>

      <h3>현재 할인 중인 상품 목록</h3>
      <table>
        <thead>
          <tr>
            <th>이미지</th>
            <th>상품명</th>
            <th>정가</th>
            <th>할인률(%)</th>
            <th>할인가</th>
          </tr>
        </thead>
        <tbody className='discountPage_tbody'>
            {discountItems.length > 0 ? (
                discountItems.map(item => (
                <tr className='discountPage_list' key={item.item_origin_id}>
                    <td className='discountPage_img'>
                    <img src={`http://192.168.0.20:8080/${item.item_img}`} alt={item.item_name} />
                    </td>
                    <td>{item.item_name}</td>
                    <td>{item.item_price}원</td>
                    <td>{item.discount_rate}%</td>
                    <td>{item.discount_price}원</td>
                </tr>
                ))
            ) : (
                <tr><td colSpan="5">할인 상품이 없습니다.</td></tr>
            )}
        </tbody>
      </table>
    </div>
  );
}

export default Discount_List;

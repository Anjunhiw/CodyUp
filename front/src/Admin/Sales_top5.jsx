import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Sales_top5.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faMedal } from '@fortawesome/free-solid-svg-icons';

const Sales_top5 = () => {

    // 순위별 아이콘 정의
    const getRankIcon = (rank) => {
    if (rank === 1) return <FontAwesomeIcon icon={faCrown} style={{ color: 'gold', marginRight: '5px' }} />;
    if (rank === 2) return <FontAwesomeIcon icon={faMedal} style={{ color: 'silver', marginRight: '5px' }} />;
    if (rank === 3) return <FontAwesomeIcon icon={faMedal} style={{ color: '#cd7f32', marginRight: '5px' }} />; // 동메달
    return null;
};  
    const navigate = useNavigate();

    const[data, setData] = useState([]);
  
    useEffect(() => {
     fetch(`http://192.168.0.20:8080/admin/sales/rank`)
    .then((res) => res.json())
      .then((data) => {
      if (Array.isArray(data)) {
        setData(data);
      } else {
        console.error("응답 데이터 형식 오류:", data);
        setData([]);
      }
    })
    .catch((err) => {
      console.error("매출 top5 요청 실패:", err);
      setData([]);
    });
}, []); 
  return (
    <div>
      <select className='sales-top-select' onChange={(e) => navigate(e.target.value)}>
        <option>날짜/상품/TOP</option>
        <option value="/Sales_Overview">날짜별 총 매출</option>
        <option value="/Sales_Overview/Sales_product">상품별 총 매출</option>
        <option value="/Sales_Overview/Sales_top5">TOP 5 상품</option>
      </select>
      <h1>상품 TOP 5</h1>
      <table className='sales-top-table'>
        <thead>
          <tr>
            <th>상품명</th>
            <th>판매 수량</th>
            <th>총 매출</th>
            <th>수량 기준 순위</th>
            <th>매출 기준 순위</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.item_name}</td>
              <td>{item.quantity}</td>
              <td>{item.total_price ? item.total_price.toLocaleString() : '0'}</td>
              <td>
               {item.by_quantity ? (
                <>
               {getRankIcon(item.by_quantity)} No.{item.by_quantity}
                 </>
              ) : '-'}
              </td>
              <td>
               {item.by_sales ? (
                <>
              {getRankIcon(item.by_sales)} No.{item.by_sales}
                </>
              ) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sales_top5
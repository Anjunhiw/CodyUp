import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Sales_Overview.css';

const Sales_Overview = () => {

  const navigate = useNavigate();

  const [orderDate, setOrderDate] = useState('');
  const [count, setCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식
  });
  const handleChange = (e) => {
    setDate(e.target.value);
  };

  const handleSearch = () => {

    if(!date) return;

    //console.log("조회 요청 날짜:", date); 

    fetch(`http://192.168.0.20:8080/admin/sales?date=${date}`)
    .then((res)=>res.json())
    .then((data)=> {
      if(data.order_option && typeof data.total_price === 'number' && data.order_date) {
      setCount(data.order_option.quantity);
      setTotalSales(data.total_price);
      setOrderDate(data.order_date);
      } else {
        setCount(0);
        setTotalSales(0);
        setOrderDate('');
      }
    })
    .catch((error) => {
      console.error('데이터 불러오기 실패:', error);
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <div className='sales-date'>
      <div className='sales-date-header'>
      <select onChange={(e) => navigate(e.target.value)}>
        <option>날짜/상품/TOP</option>
        <option value="">날짜별 총 매출</option>
        <option value="Sales_product">상품별 총 매출</option>
        <option value="Sales_top5">TOP 5 상품</option>
      </select>

      <h1 className='sales-date-title'>날짜별 매출 조회</h1>
        <input className='sales-date-inp'type='date' 
              value={date} onChange={handleChange}></input>
        <button className='sales-date-btn'onClick={handleSearch}>조회</button>
      </div>
      <table className='sales-date-table'>
        <thead>
          <tr>
            <th>날짜</th>
            <th>판매 수량</th>
            <th>총 매출</th>
          </tr>
        </thead>
        <tbody>{orderDate ? (
            <tr>
              <td>{orderDate}</td>
              <td>{count}</td>
              <td>{totalSales.toLocaleString()} 원</td>
            </tr>
          ) : null}</tbody>
      </table>
    </div>
  )
}

export default Sales_Overview
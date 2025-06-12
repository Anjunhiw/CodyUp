import React, { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './Sales_product.css';

const Sales_product = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [ productName, setProductName] = useState('');
  const [count, setCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSearch = () => {
    if(!name) return;

    fetch(`http://192.168.0.20:8080/admin/sales/product?name=${name}`)
    .then((res) => res.json())
    .then((data) => {

      if(data && data.order_option && data.total_price) {
        setProductName(data.order_option.item_name);
        setCount(data.order_option.quantity);
        setTotalSales(data.total_price);
      } else {
        setProductName('');
        setCount(0);
        setTotalSales(0);
      }
    })
    .catch((error) => {
      console.error('데이터 불러오기 실패:' , error);
    });
  };

  return (
    <div>
       <select className='sales-product-select' onChange={(e) => navigate(e.target.value)}>
        <option>날짜/상품/TOP</option>
        <option value="/Sales_Overview">날짜별 총 매출</option>
        <option value="/Sales_Overview/Sales_product">상품별 총 매출</option>
        <option value="/Sales_Overview/Sales_top5">TOP 5 상품</option>
      </select>
      <h1>상품별 매출 조회</h1>
      <input className='sales-product-inp' type='text' value={name} 
            onChange={handleChange}
            placeholder='상품명을 입력하세요'></input>
      <button className='sales-product-btn' onClick={handleSearch}>조회</button>

      <table className='sales-product-table'>
        <thead>
          <tr>
            <th>상품</th>
            <th>판매 수량</th>
            <th>총 매출</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{productName}</td>
            <td>{count}</td>
            <td>{totalSales.toLocaleString()} 원</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Sales_product
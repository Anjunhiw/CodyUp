import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

const Sales_Overview = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(()=>{
    fetch('http://192.168.0.25:8080/admin/orders')
    .then((res)=>res.json())
    .then((data)=> {setSalesData(data);})
    .catch((error) => {
      console.error('매출 불러오기 실패:', error);
    })
    },[]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>주문 건수</th>
            <th>총 매출</th>
          </tr>
        </thead>
        <tbody>
          {salesData.length === 0 ?(
            <tr>
              <td colSpan="3">매출 데이터가 없습니다.</td>
              </tr>
          ) : (
            salesData.map(({order_date,total_price }, index)=>(
              <tr key={index}>
                <td>{order_date}</td>
                
                <td>{total_price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Sales_Overview

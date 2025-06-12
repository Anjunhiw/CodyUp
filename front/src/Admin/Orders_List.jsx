import React, { useEffect, useState } from 'react'
import './Orders_List.css';

const Orders_List = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); //현재 보고 있는 페이지
  const itemsPerPage = 5; // 한 페이지에 5개만
  const indexOfLastItem = currentPage * itemsPerPage; //페이지의 마지막 항목 인덱스 계산
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; //페이지의 첫번째 항목 인덱스 계산
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem); //페이지에 보여줄 항목들만 잘라냄

  useEffect(() => {
    fetch('http://192.168.0.20:8080/admin/orders')
      .then((res) => res.json())
      .then ((data) => {
        const sortedData = data.sort( //최신날짜 기준 정렬
        (a, b) => new Date(b.order_date) - new Date(a.order_date)
        );
        setOrders(sortedData);
      })
      .catch((error) => {
        console.error('주문 목록 조회 실패:', error);
      })
  },[]);

  const handleCancle = (orderId) => {
    fetch(`http://192.168.0.20:8080/admin/${orderId}/cancel`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if(!res.ok)throw new Error('주문 취소 실패');
      return res.json();
    })
    .then((data) => {
      const confirmed = window.confirm('해당 주문을 취소하시겠습니까?');
      if (confirmed) {
        alert('주문이 취소되었습니다.');
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: '주문 취소' } : order
          )
        );
      } else {
        // 취소를 누른 경우 아무 동작도 하지 않음
      }
    })
    .catch((err) => {
      console.error(err);
      alert('주문 취소 중 오류 발생');
    });
  };
  return (
     <div>
      <h2>주문 내역</h2>
      {orders.length === 0 ? (
        <p>주문한 회원이 없습니다.</p>
      ) : (
        currentItems.map((order,index)=>(
        <div className='Box-order' key={index}>
        <div className='info-order'>회원 아이디: {order.user_id}</div>
        <div className='info-order'>결제금액: {Math.round(order.total_price).toLocaleString()}원</div>
        <div className='info-order'>주문날짜: {new Date(order.order_date).toLocaleString()}</div>
        <div className='info-order'>
          상태: {''}
          <span className={order.status === '주문 취소' ? 'status-cancel' : ''}>
            {order.status}
          </span>
           <div className='info-order'>
         <button onClick={() => handleCancle(order.order_id)}>주문취소</button>
         </div>
       </div>
        <table className='table-order'>
          <thead>
            <tr>
              <th>상품명</th>
              <th>색상</th>
              <th>사이즈</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            {JSON.parse(order.order_option).map((item,idx) => (
              <tr key={idx}>
                <td>{item.item_name}</td>
                <td>{item.color}</td>
                <td>{item.size}</td>
                <td>{item.quantity}개</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        ))
      )}
      <div className='pagebtn'>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
            이전
        </button>
        <span>{currentPage}</span>
        <button onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={indexOfLastItem >= orders.length}>
            다음
          </button>
      </div>
    </div>

  )
}

export default Orders_List
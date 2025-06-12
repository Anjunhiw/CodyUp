import { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css';


function MyOrders({ userId }) {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);  

    const renderPageNumbers = () => {
  const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(
        <button
            key={i}
            onClick={() => setCurrentPage(i)}
            style={{
            margin: '0 4px',
            backgroundColor: currentPage === i ? '#333' : '#eee',
            color: currentPage === i ? '#fff' : '#000',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
            }}
        >
            {i}
        </button>
        );
    }
    return pages;
    };

    useEffect(() => {
        axios.get(`http://192.168.0.20:8080/mypage/orders/${userId}`)
        .then(res => {
            if (res.data.success) {
            setOrders(res.data.orders);
            }
        })
        .catch(err => console.error("주문 내역 조회 실패", err));
    }, [userId]);

    return (
    <div className="order-container">
        <h2>내 주문내역</h2>
        {orders.length === 0 ? (
            <p>주문한 내역이 없습니다.</p>
        ) : (
            <div>
            {currentOrders.map(order => (
                <div key={order.order_id} className="order-box"> 
                <div className="order-info">결제 금액: {Math.round(order.total_price).toLocaleString()} 원</div>
                <div className="order-info">주문날짜: {new Date(order.order_date).toLocaleString()}</div>
                <table className="order-table">
                    <thead>
                    <tr>
                        <th>상품명</th>
                        <th>색상</th>
                        <th>사이즈</th>
                        <th>수량</th>
                    </tr>
                    </thead>
                    <tbody>
                    {JSON.parse(order.order_option).map((item, idx) => (
                        <tr key={idx}>
                        <td className='order_item_name'>{item.item_name}</td>
                        <td>{item.color}</td>
                        <td>{item.size}</td>
                        <td>{item.quantity}개</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ))}

            {/* 페이지네이션 버튼 표시 */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {renderPageNumbers()}
            </div>
          </div>
        )}
        </div>
        );
        }

export default MyOrders;

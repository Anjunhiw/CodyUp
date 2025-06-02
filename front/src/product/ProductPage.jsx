import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductPage.css';
import WishButton from './WishButton';
import CartButton from './CartButton';

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [orderMessage, setOrderMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState(0);
  // 상태 관련
  const currentUserId = sessionStorage.getItem('user_id');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');

  const variants = product?.item_option ? JSON.parse(product.item_option).variants : [];

  const availableColors = [...new Set(variants.map(v => v.color))];
  const availableSizes = selectedColor
    ? [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))]
    : [];  

  useEffect(() => {
    const match = variants.find(v => v.color === selectedColor && v.size === selectedSize);
    setMaxAmount(match?.amount || 0);
    if (selectedAmount > (match?.amount || 0)) {
      setSelectedAmount(1);
    }
  }, [selectedColor, selectedSize]);


  useEffect(() => {
    // 상품 정보 불러오기
    fetch(`http://192.168.0.20:8080/item/${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('상세 상품 불러오기 실패:', err));

    // 리뷰 불러오기
    axios.get(`http://192.168.0.20:8080/item/review/${productId}`)
  .then(res => {
    const data = res.data;

    if (Array.isArray(data.reviews)) {
      setReviews(data.reviews);
      setReviewCount(data.reviews.length); // ⬅️ 여기!
    } else if(typeof data.reviews === 'object' && data.reviews !== null){
      setReviews([data.reviews]);
      setReviewCount(data.reviews.length);
    } else {
      console.warn("리뷰 데이터 형식이 잘못됨:", data);
      setReviews([]);
      setReviewCount(0); // fallback
    }
  })
  .catch(err => {
    console.error("리뷰 불러오기 실패:", err);
    setReviews([]);
    setReviewCount(0);
  });
  }, [productId]);

  const handleOrder = () => {
    if (!selectedSize || !selectedColor || selectedAmount <= 0) {
      alert("옵션과 수량을 정확히 선택해주세요.");
      return;
    }

    axios.post('http://192.168.0.20:8080/item/buy', {
      item_origin_id: product?.item_origin_id,
      item_size: selectedSize,
      item_color: selectedColor,
      item_amount: selectedAmount
    })
      .then(res => {
        if (res.data.success) {
          alert(res.data.message);
          setOrderMessage('');
        } else {
          alert(res.data.message);
          setOrderMessage(res.data.message);
        }
      })
      .catch(err => {
        const msg = err.response?.data?.message || '주문 실패';
        setOrderMessage(msg);
      });
  };

  const handleSubmitReview = () => {
  if (!reviewText.trim()) return;

  const newReview = {
    user_id: sessionStorage.getItem("user_id"),
    item_id: productId,
    review_content: reviewText
  };

  axios.post('http://192.168.0.20:8080/item/review', newReview)
    .then(() => {
      // 등록 성공 후 목록 갱신
      axios.get(`http://192.168.0.20:8080/item/review/${productId}`)
        .then(res => {
          const data = res.data;
          if (Array.isArray(data.reviews)) {
            setReviews(data.reviews);
            setReviewCount(data.reviews.length);
          } else {
            console.warn("리뷰 응답이 배열이 아님", data);
            setReviews([]);
            setReviewCount(0);
          }
        });
      setReviewText('');
      alert("상품후기 작성을 완료하셨습니다.");
    })
    .catch(err => {
      console.error('리뷰 등록 실패:', err);
    });
};

  // 수정 버튼 클릭 시 실행
  const handleEditClick = (review) => {
    setEditingReviewId(review.review_id);
    setEditedReviewText(review.review_content);
  };

  //새로 고침 
  const fetchReviews = () => {
    axios.get(`http://192.168.0.20:8080/item/review/${productId}`)
      .then(res => {
        const data = res.data;
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setReviewCount(data.reviews.length);
        } else {
          setReviews([]);
          setReviewCount(0);
        }
      })
      .catch(err => {
        console.error("리뷰 불러오기 실패:", err);
        setReviews([]);
        setReviewCount(0);
      });
  };

  // 저장 버튼 클릭 시 실행
  const handleUpdateReview = () => {
    if (!editedReviewText.trim()) return;

    axios.put(`http://192.168.0.20:8080/item/review/${editingReviewId}`, {
      review_content: editedReviewText,
    })
      .then(() => {
        setEditingReviewId(null);
        setEditedReviewText('');
        fetchReviews(); // 리뷰 목록 새로고침
      })
      .catch(err => console.error('리뷰 수정 실패:', err));
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;

    axios.delete(`http://192.168.0.20:8080/item/review/${reviewId}`)
      .then(() => setReviews(prev => prev.filter(r => r.review_id !== reviewId)))
      .catch(err => console.error('리뷰 삭제 실패:', err));
  };

  function getKoreanDateWithDayNDaysLater(n) {
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const date = new Date();
    date.setDate(date.getDate() + n);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    return `${month}월 ${day}일 (${weekday})`;
  }

  function maskUserId(userId) {
    if (!userId || userId.length < 4) return '익명';
    return `${userId.slice(0, 2)}${'*'.repeat(userId.length - 4)}${userId.slice(-2)}`;
  }

  const myReviews = reviews.filter(r => r.user_id === currentUserId);
  const otherReviews = reviews.filter(r => r.user_id !== currentUserId);  



  if (!product) return <div>상품 정보를 불러오는 중...</div>;

  return (
    <div className="product_page_container">
      <div className="product_page_card">
        <div className="product_page_image_section">
          <img
            src={`http://192.168.0.20:8080/${product.item_img}`}
            alt={product.item_name}
            className="product_page_image"
          />
        </div>

        <div className="product_page_info_section">
          <h1 className="product_page_name">{product.item_name}</h1>
          <p className="product_page_price">가격: ₩{product.item_price.toLocaleString()}</p>
          <p className="product_page_dd">{getKoreanDateWithDayNDaysLater(2)} 도착예정</p>

          <label>색상 선택</label>
          <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
            <option value="">선택</option>
            {availableColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>


          <label>사이즈 선택</label>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          <option value="">선택</option>
            {availableSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <label>수량</label>
          <input
            className='product_page_slt'
            type="number"
            min="1"
            max={maxAmount}
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(Number(e.target.value))}
            onKeyDown={(e) => e.preventDefault()}
            disabled={maxAmount === 0}
          />

          <p>총 가격: ₩{(product.item_price * selectedAmount).toLocaleString()}</p>
          {/* ✅ 옵션 선택 UI 추가 끝 */}


          <div className="product_page_button_group">
            <button
              className="product_page_order_button"
              onClick={handleOrder}
              disabled={maxAmount === 0}
            >
              {maxAmount === 0 ? '품절' : '주문하기'}
            </button>
            <CartButton item={product} />
          </div>
          
          <div className="product_page_dd">{getKoreanDateWithDayNDaysLater(2)} 도착 예정</div>
          
          <div style={{ width: '40%', marginTop: '10px' }}>
            <WishButton itemId={productId} />
          </div>
          
          {orderMessage && <p className="product_page_order_message">{orderMessage}</p>}

        </div>
        </div>
        <div className="product_page_review_section">
          <h3 className="product_page_review_title">리뷰({reviewCount})</h3>
          <textarea
            className="product_page_review_input"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="리뷰를 작성해주세요."
          />
          <button className="product_page_review_submit" onClick={handleSubmitReview}>
            리뷰 등록
          </button>

          <ul className="product_page_review_list">
            {[...myReviews, ...otherReviews].length === 0 ? (
          <li>아직 작성된 리뷰가 없습니다.</li>
        ) : (
          [...myReviews, ...otherReviews].map((review, idx) => (
            <li key={review.review_id || idx} className="product_page_review_item">
              <strong>{review.user_id === currentUserId ? '나' : maskUserId(review.user_id)}</strong>: 
              {review.user_id === currentUserId && editingReviewId === review.review_id ?  (
                  <>
                    <textarea
                      value={editedReviewText}
                      onChange={(e) => setEditedReviewText(e.target.value)}
                      style={{ width: '100%', marginTop: '6px' }}
                    />
                    <div style={{ marginTop: '6px' }}>
                      <button onClick={handleUpdateReview} style={{ marginRight: '10px' }}>저장</button>
                      <button onClick={() => setEditingReviewId(null)}>취소</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>: {review.review_content}</span>
                    {review.user_id === currentUserId && (
                      <>
                        <button
                          style={{ marginLeft: '12px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                          onClick={() => handleEditClick(review)}
                        >
                        수정
                        </button>
                        <button
                          style={{ marginLeft: '6px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                          onClick={() => handleDeleteReview(review.review_id)}
                        >
                        삭제
                        </button>
                      </>
                    )}
                  </>
              )}
            </li>
          ))
        )}
          </ul>
        </div>
    </div>
  );
}

export default ProductPage;

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductPage.css';
import WishButton from './WishButton';
import CartButton from './CartButton';
import Pagination from './Pagination';

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [orderMessage, setOrderMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState(0);
  const [relatedItems, setRelatedItems] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const currentUserId = sessionStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://192.168.0.20:8080/item/${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('상세 상품 불러오기 실패:', err));

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    fetch('http://192.168.0.20:8080/item')
      .then(res => res.json())
      .then(data => {
        const others = data.filter(item => item.item_origin_id !== product.item_origin_id);
        const sameCatBrand = others.filter(i => i.category_id === product.category_id && i.item_brand === product.item_brand);
        const sameCat = others.filter(i => i.category_id === product.category_id && i.item_brand !== product.item_brand);
        const sameBrand = others.filter(i => i.item_brand === product.item_brand && i.category_id !== product.category_id);
        const seen = new Set();
        const unique = [...sameCatBrand, ...sameCat, ...sameBrand].filter(item => {
          if (seen.has(item.item_origin_id)) return false;
          seen.add(item.item_origin_id);
          return true;
        }).slice(0, 4);
        setRelatedItems(unique);
      })
      .catch(err => console.error("관련 상품 로딩 실패:", err));
  }, [product]);

  
  const fetchReviews = () => {
    axios.get(`http://192.168.0.20:8080/item/review/${productId}`)
      .then(res => {
        setReviews(Array.isArray(res.data.reviews) ? res.data.reviews : []);
        setCurrentPage(1);
      })
      .catch(() => setReviews([]));
  };

  const variants = product?.item_option ? JSON.parse(product.item_option).variants : [];
  const availableColors = [...new Set(variants.map(v => v.color))];
  const availableSizes = selectedColor ? [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))] : [];

  useEffect(() => {
    const match = variants.find(v => v.color === selectedColor && v.size === selectedSize);
    setMaxAmount(match?.amount || 0);
    setSelectedAmount(prev => (match?.amount && prev > match.amount) ? 1 : Math.max(prev, 1));
  }, [selectedColor, selectedSize, variants]);

  const handleOrder = () => {
  if (!selectedSize || !selectedColor || selectedAmount <= 0) {
    alert("옵션과 수량을 정확히 선택해주세요.");
    return;
  }

  const user_id = sessionStorage.getItem("user_id"); // 또는 props, context 등에서 가져오기
  if (!user_id) {
    alert("로그인이 필요합니다.");
    return;
  }

  const orderData = {
    user_id,
    order_items: [
      {
        cart_id: null, // 장바구니 아닌 직접 구매
        item_origin_id: product?.item_origin_id,
        quantity: selectedAmount,
        color: selectedColor,
        size: selectedSize
      }
    ]
  };

  axios.post("http://192.168.0.20:8080/mypage/cart/order", orderData)
    .then(res => {
      if (res.data.success) {
        alert("주문이 완료되었습니다.");
        setOrderMessage('');
        fetch(`http://192.168.0.20:8080/item/${productId}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);   // 이걸로 product가 바뀌면 위의 useMemo가 자동 반영
          setSelectedAmount(1); // 수량 초기화

          const updatedVariants = JSON.parse(data.item_option).variants;
          const match = updatedVariants.find(
            v => v.color === selectedColor && v.size === selectedSize
          );
          setMaxAmount(match?.amount || 0);
        });

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
    if (!reviewText.trim() || reviewRating === 0) return;
    axios.post('http://192.168.0.20:8080/item/review', {
      user_id: currentUserId,
      item_id: productId,
      review_content: reviewText,
      rating: reviewRating
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      setReviewText('');
      setReviewRating(0);
      setShowReviewInput(false);
      fetchReviews();
    });
  };

  //수정 클릭시 
  const handleEditClick = (review) => {
    setEditingReviewId(review.review_id);
    setEditedReviewText(review.review_content);
    setEditedRating(review.rating);
  };

  //저장 클릭시 
  const handleUpdateReview = () => {
    if (!editedReviewText.trim()) return;
    axios.put(`http://192.168.0.20:8080/item/review/${editingReviewId}`, {
      review_content: editedReviewText,
      rating: editedRating
    }).then(() => {
      setEditingReviewId(null);
      setEditedReviewText('');
      fetchReviews();
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      axios.delete(`http://192.168.0.20:8080/item/review/${reviewId}`).then(fetchReviews);
    }
  };

  const renderStars = (value, onChange = null) => (
    <div style={{ margin: '4px 0' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange && onChange(star)}
          style={{
            fontSize: '1.2rem',
            color: star <= value ? '#ffc107' : '#ccc',
            cursor: onChange ? 'pointer' : 'default'
          }}
        >★</span>
      ))}
    </div>
  );

  const getKoreanDateWithDayNDaysLater = (n) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date();
    date.setDate(date.getDate() + n);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  // reviews가 빈 배열이면 0, 아니면 평균 별점 계산
  const averageRating = reviews.length
    ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
    : 0;


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
          <p className="product_page_price">
            가격:
            {product.discount_rate > 0 ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                  ₩{product.item_price.toLocaleString()}
                </span>
                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  ₩{product.discount_price.toLocaleString()}
                </span>
              </>
            ) : (
              <> ₩{product.item_price.toLocaleString()} </>
            )}
          </p>
          <label>색상 선택</label>
          <select
            className='product_page_slt'
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              setSelectedSize('');
            }}
          >
            <option value="">선택</option>
            {availableColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          <label>사이즈 선택</label>
          <select
            className='product_page_slt'
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            disabled={!selectedColor}
          >
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
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val > maxAmount) val = maxAmount;
              else if (val < 1) val = 1;
              setSelectedAmount(val);
            }}
            disabled={maxAmount === 0}
          />
          남은 수량: {maxAmount}

          <p className='product_page_tatal_price_p'>
            총 가격: ₩{
              (
                (product.discount_rate > 0 ? product.discount_price : product.item_price) *
                selectedAmount
              ).toLocaleString()
            }
          </p>

          <div className="product_page_button_group">
            <button
              className="product_page_order_button"
              onClick={handleOrder}
              disabled={maxAmount === 0}
            >
              {maxAmount === 0 ? '품절' : '주문하기'}
            </button>
            <CartButton
              item={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              selectedAmount={selectedAmount}
            />
          </div>

          <div className="product_page_dd">{getKoreanDateWithDayNDaysLater(2)} 도착 예정</div>

          <div style={{ width: '40%', marginTop: '10px' }}>
            <WishButton
              itemId={product.item_origin_id}
              itemName={product.item_name}
              itemImg={product.item_img}
              itemPrice={product.item_price}
            />
          </div>

          {orderMessage && <p className="product_page_order_message">{orderMessage}</p>}
        </div>
      </div>

      <div className="product_page_detail_section">
        <button
          className="product_page_detail_toggle"
          onClick={() => setShowDetail(prev => !prev)}
        >
          {showDetail ? '상품 정보 닫기 ▲' : '상품 정보 더보기 ▼'}
        </button>
        {showDetail && (
          <div className="product_page_detail_content">
            <p>{product.item_description || '상품에 대한 설명이 여기에 표시됩니다.'}</p>
          </div>
        )}
      </div>

    <div className="related-products-container">
      <h3 className="related-products-title">관련 상품</h3>
      <div className="related-products-list">
    {relatedItems.map(item => (
      <div
        key={item.item_origin_id}
        className="related-product-card"
        onClick={() => navigate(`/item/${item.item_origin_id}`)}
      >
        <img 
          src={`http://192.168.0.20:8080/${item.item_img}`} 
          alt={item.item_name} 
        />
        <p>{item.item_name}</p>
      </div>
        ))}
      </div>
    </div>

      {/* 리뷰 작성 및 리스트 */}
      <div className="product_page_review_section">
        <h3 
  className="product_page_review_title" 
  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
>
  <span>리뷰({reviews.length})</span>

  {reviews.length > 0 && (
    <span style={{ display: 'flex', alignItems: 'center', color: '#ffc107', fontSize: '1.1rem' }}>
      {renderStars(Math.round(averageRating))}
      <span style={{ color: '#333', marginLeft: '6px', fontWeight: 'bold', fontSize: '1rem' }}>
        {averageRating}
      </span>
    </span>
  )}

  <button onClick={() => setShowReviewInput(true)} className="review_add_btn" style={{ marginLeft: 'auto' }}>
    새 리뷰 작성
  </button>
</h3>

<br />


        {showReviewInput && (
          <div style={{ width:'70%',marginBottom: '20px' , margin:'0 auto'}}>
            {renderStars(reviewRating, setReviewRating)}
            <div>
            <textarea style={{ width: '100%', height:'100px', resize:'none' }} value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} />
            </div>
            <div className='rv_buttons'>
            <button onClick={handleSubmitReview}>등록</button>
            <button onClick={() => { setShowReviewInput(false); setReviewText(''); setReviewRating(0); }}>취소</button>
            </div>
          </div>
        )}

        {[...currentReviews]
  .sort((a, b) => {
    const aIsMine = a.user_id === currentUserId ? -1 : 0;
    const bIsMine = b.user_id === currentUserId ? -1 : 0;
    return aIsMine - bIsMine;
  })
  .map(review => (
    <div
      key={review.review_id}
      style={{
        borderBottom: '1px solid #ccc',
        padding: '8px 0',
        marginTop: '10px',
        textAlign: 'left'
      }}
    >
      <p style={{ fontWeight: 'bold' }}>
        {review.user_name || review.user_id} - {new Date(review.created_at).toLocaleString()}
      </p>
      {renderStars(review.rating)}
      {editingReviewId === review.review_id ? (
        <>
          {renderStars(editedRating, setEditedRating)}
          <textarea
            value={editedReviewText}
            onChange={(e) => setEditedReviewText(e.target.value)}
            rows={3}
          />
          <button onClick={handleUpdateReview}>저장</button>
          <button onClick={() => setEditingReviewId(null)}>취소</button>
        </>
      ) : (
        <>
          <p>{review.review_content}</p>
          {currentUserId === review.user_id && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => handleEditClick(review)}>수정</button>
              <button onClick={() => handleDeleteReview(review.review_id)}>삭제</button>
            </div>
          )}
        </>
      )}
    </div>
))}


        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default ProductPage;
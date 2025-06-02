import { useEffect, useState } from 'react';
import './SubCategoryPage.css';
import PriceSlider from './Priceslider';
import { useParams, useNavigate } from 'react-router-dom';

function SubCategoryPage() {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortType, setSortType] = useState('latest');
  const { subId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let a;
    let b;

    if (Number(subId) === 99) {
      a = 1;
      b = 4;
    }
    else if (Number(subId) === 98){
      a = 5;
      b = 6;
    }
    else {
      a = Number(subId);
      b = Number(subId);
    }

    fetch('http://192.168.0.20:8080/item')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(item => item.category_id >= a && item.category_id <= b);
        setProducts(filtered);
      })
      .catch(err => console.error('상품 불러오기 실패:', err));
  }, [subId]);

  useEffect(() => {
    const filtered = products.filter(
      item => item.item_price >= priceRange[0] && item.item_price <= priceRange[1]
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortType === 'price_asc') return a.item_price - b.item_price;
      if (sortType === 'price_desc') return b.item_price - a.item_price;
      if (sortType === 'latest') return new Date(b.item_created_at) - new Date(a.item_created_at);
      if (sortType === 'oldest') return new Date(a.item_created_at) - new Date(b.item_created_at);
      if (sortType === 'name_asc') return a.item_name.localeCompare(b.item_name);
      return 0;
    });

    setFilteredItems(sorted);
  }, [products, priceRange, sortType]);

  const goToProductPage = (productId) => {
    navigate(`/item/${productId}`);
  };

  return (
    <div className="subcategory-container">
      <aside className="filter-panel">
        <h4 style={{ fontSize: '1.1vw' }}>필터</h4>
        <div>
          <div style={{ fontSize: '1.1vw' }}>가격 범위</div>
          <div className='priceslider_div'>
            <PriceSlider range={priceRange} onChange={setPriceRange} />
          </div>
          <div style={{ fontSize: '1vw' }}>
            {priceRange[0].toLocaleString()}원 ~ {priceRange[1].toLocaleString()}원
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label style={{ fontSize: '1.1vw' }}>정렬: </label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={{
              borderWidth: 2.5,
              width: '60%',
              marginTop: '5px',
              height: '1.7vw',
              fontSize: '0.85vw'
            }}
          >
            <option style={{ fontSize: '0.8vw' }} value="latest">최신순</option>
            <option style={{ fontSize: '0.8vw' }} value="oldest">오래된순</option>
            <option style={{ fontSize: '0.8vw' }} value="price_asc">가격 낮은순</option>
            <option style={{ fontSize: '0.8vw' }} value="price_desc">가격 높은순</option>
            <option style={{ fontSize: '0.8vw' }} value="name_asc">가나다순</option>
          </select>
        </div>

        <br />

        <div style={{ fontSize: '1.1vw' }}><input type="checkbox" /> 옵션1</div>
        <div style={{ fontSize: '1.1vw' }}><input type="checkbox" /> 옵션2</div>
      </aside>

      <main className="product-grid">
        {filteredItems.length === 0 ? (
          <p style={{ fontSize: '1.2vw' }}>조건에 맞는 상품이 없습니다.</p>
        ) : (
          filteredItems.map(product => (
            <div key={product.item_origin_id} className="product-card">
              <img
                onClick={() => goToProductPage(product.item_origin_id)}
                src={`http://192.168.0.20:8080/${product.item_img}`}
                alt={product.item_name}
              />
              <p>{product.item_name}</p>
              <p>{product.item_price.toLocaleString()}원</p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default SubCategoryPage;

import { useEffect, useState } from 'react';
import './SubCategoryPage.css';
import PriceSlider from './PriceSlider';
import { useParams, useNavigate } from 'react-router-dom';

function SubCategoryPage() {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortType, setSortType] = useState(() => {
    return localStorage.getItem('sortType') || 'latest';
  });

  const { subId } = useParams();
  const navigate = useNavigate();

  const subCategoryNames = {
    99: '상의 전체',
    1: '셔츠',
    2: '후드',
    3: '니트',
    4: '반팔',
    98: '하의 전체',
    5: '긴 바지',
    6: '반 바지',
  };

  useEffect(() => {
    let a, b;

    if (Number(subId) === 99) {
      a = 1; b = 4;
    } else if (Number(subId) === 98) {
      a = 5; b = 6;
    } else {
      a = Number(subId); b = Number(subId);
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
    localStorage.setItem('sortType', sortType);
  }, [sortType]);

  useEffect(() => {
    const filtered = products.filter(item => {
      const matchPrice = item.item_price >= priceRange[0] && item.item_price <= priceRange[1];

      let variants = [];
      if (item.item_option) {
        try {
          variants = JSON.parse(item.item_option).variants || [];
        } catch (err) {
          console.error('옵션 파싱 실패:', err);
        }
      }

      const matchColor = !selectedColor || variants.some(v => v.color === selectedColor);
      const matchSize = !selectedSize || variants.some(v => v.size === selectedSize && (!selectedColor || v.color === selectedColor));
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(item.item_brand);

      return matchPrice && matchColor && matchSize && matchBrand;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortType === 'price_asc') return a.item_price - b.item_price;
      if (sortType === 'price_desc') return b.item_price - a.item_price;
      if (sortType === 'latest') return new Date(b.item_created_at) - new Date(a.item_created_at);
      if (sortType === 'oldest') return new Date(a.item_created_at) - new Date(b.item_created_at);
      if (sortType === 'name_asc') return a.item_name.localeCompare(b.item_name);
      return 0;
    });

    setFilteredItems(sorted);
  }, [products, priceRange, sortType, selectedColor, selectedSize, selectedBrands]);

  const goToProductPage = (productId) => {
    navigate(`/item/${productId}`);
  };

  const allVariants = products.flatMap(item => {
    try {
      return item.item_option ? JSON.parse(item.item_option).variants : [];
    } catch {
      return [];
    }
  });

  const colorOptions = [...new Set(allVariants.map(v => v.color))];
  const sizeOptions = selectedColor
    ? [...new Set(allVariants.filter(v => v.color === selectedColor).map(v => v.size))]
    : [...new Set(allVariants.map(v => v.size))];

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="subcategory-container">
      <aside className="filter-panel">
        <h4 style={{ fontSize: '1.1vw' }}>필터</h4>

        {/* 가격 */}
        <div>
          <div style={{ fontSize: '1.1vw' }}>가격 범위</div>
          <div className='priceslider_div'>
            <PriceSlider range={priceRange} onChange={setPriceRange} />
          </div>
          <div style={{ fontSize: '1vw' }}>
            {priceRange[0].toLocaleString()}원 ~ {priceRange[1].toLocaleString()}원
          </div>
        </div>

        {/* 정렬 */}
        <div style={{ marginTop: '10px' }}>
          <label style={{ fontSize: '1.1vw' }}>정렬: </label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={{ height: '1.5vw', width: '60%', fontSize: '1vw' }}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
            <option value="name_asc">가나다순</option>
          </select>
        </div>

        {/* 색상 */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '1.1vw' }}>색상</div>
          <select
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              setSelectedSize('');
            }}
            style={{ height: '1.5vw', width: '80%', fontSize: '1.1vw' }}
          >
            <option value="">전체</option>
            {colorOptions.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        {/* 사이즈 */}
        <div style={{ marginTop: '7px' }}>
          <div style={{ fontSize: '1.1vw' }}>사이즈</div>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            style={{ height: '1.5vw', width: '80%', fontSize: '1.1vw' }}
            disabled={selectedColor && sizeOptions.length === 0}
          >
            <option value="">전체</option>
            {sizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* 브랜드 */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '1.5vw' }}>브랜드</div>
          <label style={{ fontSize: '1.3vw' }}>
            <input
              type="checkbox"
              value="1"
              checked={selectedBrands.includes('1')}
              onChange={() => handleBrandChange('1')}
            />
            브랜드 a
          </label>
          <br />
          <label style={{ fontSize: '1.3vw' }}>
            <input
              type="checkbox"
              value="2"
              checked={selectedBrands.includes('2')}
              onChange={() => handleBrandChange('2')}
            />
            브랜드 b
          </label>
          <br />
          <label style={{ fontSize: '1.3vw' }}>
            <input
              type="checkbox"
              value="3"
              checked={selectedBrands.includes('3')}
              onChange={() => handleBrandChange('3')}
            />
            브랜드 c
          </label>
        </div>
      </aside>

      <main className="product-grid">
        <h2 style={{ gridColumn: '1 / -1', fontSize: '1.5vw', marginBottom: '10px' }}>
          {subCategoryNames[Number(subId)] || '상품 목록'}
        </h2>

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
              <p className='prouduct-infos'>{product.item_name}</p>
              <p className='prouduct-infos'>{product.item_price.toLocaleString()}원</p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default SubCategoryPage;

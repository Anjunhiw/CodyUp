import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchResultPage.css'; 

function SearchResultPage() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!keyword) {
      setError('검색어가 없습니다.');
      setLoading(false);
      return;
    }

   axios
      .get(`http://192.168.0.20:8080/item/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => {
        //console.log('검색 결과 응답:', res.data);
        if (Array.isArray(res.data)) {
          setResults(res.data);
        } else {
          setError('검색 결과 형식이 올바르지 않습니다.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('검색 오류:', err);
        setError('검색 중 오류가 발생했습니다.');
        setLoading(false);
      });
  }, [keyword]);

  if (loading) return <div>검색 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="search-results-container">
      <h2>"{keyword}" 검색 결과</h2>
      {results.length === 0 ? (
        <p>일치하는 상품이 없습니다.</p>
      ) : (
        <ul className="search-results-list">
            {results.map((item) => (
                <li key={item.item_origin_id} className="search-result-item">
                    <a href={`/item/${item.item_origin_id}`}>
                        <img src={`http://192.168.0.20:8080/${item.item_img}`} alt={item.item_name} />
                    </a>
                    <div>{item.item_name}</div>
                    <div>
                        <p className="product_page_price">
                        가격: ₩{typeof item.item_price === 'number' ? item.item_price.toLocaleString() : '정보 없음'}
                        </p>
                    </div>
                    
                </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResultPage;
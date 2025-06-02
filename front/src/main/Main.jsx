import './Main.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Main() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://192.168.0.20:8080/item')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('상품 목록 불러오기 실패:', err));
  }, []);

  const goToProductPage = (productId) => {
    navigate(`/item/${productId}`);
  };

  const goToMain = () => {
    navigate('/');
  };

  const goToLogIn = () => {
    navigate('/Login');
  };

  // ✅ 커스텀 화살표 컴포넌트 - 불필요한 props 전달 방지
  function SampleNextArrow({ className, style, onClick }) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          background: 'gray',
          borderRadius: '50%',
          right: '10px',
          zIndex: 2
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow({ className, style, onClick }) {
    return (
      <div
        
        className={className}
        style={{
          ...style,
          display: 'block',
          background: 'gray',
          borderRadius: '50%',
          left: '10px',
          zIndex: 2
        }}
        onClick={onClick}
      />
    );
  }

  // ✅ 슬라이더 설정에서 함수 컴포넌트로 전달
  const sliderSettings = {
  infinite: true,
  centerMode: true,
  centerPadding: '10%', // 기존 60px보다 줄임
  slidesToShow: 3,
  speed: 500,
  arrows: true,
  autoplay: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  beforeChange: (oldIndex, newIndex) => setCurrentIndex(newIndex),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        centerPadding: '8%',
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        centerPadding: '15%',
      }
    }
  ]
};

  return (
    <>
      <div className="main_div_ads">
        <Slider {...{
          dots: true, infinite: true, speed: 500, slidesToShow: 1,
          slidesToScroll: 1, autoplay: true, autoplaySpeed: 6000,
          arrows: true, nextArrow: <SampleNextArrow />, prevArrow: <SamplePrevArrow />
        }}>
          {[1, 2, 3].map(i => (
            <div key={i}>
              <img className="main_img_ads" src={`src/assets/31bn${i}.jpg`} alt={`ad${i}`} />
            </div>
          ))}
        </Slider>
      </div>


    
      {/* ✅ 1~5번 슬라이더 상품 */}
      <div className="main_product_slider_container">
        <div><h3 className='main_product_slider_text'>text</h3></div>
        <Slider {...sliderSettings}>
          {products.slice(0, 5).map((item, index) => {
            const isCenter = index === currentIndex % 5;
            return (
              <div key={item.item_origin_id} className="main_img_div_slider">
                <img
                  className="main_div_1_img"
                  src={`http://192.168.0.20:8080/${item.item_img}`}
                  alt={item.item_name}
                  style={{ opacity: isCenter ? 1 : 0.5, cursor: isCenter ? 'pointer' : 'default' }}
                  onClick={() => isCenter && goToProductPage(item.item_origin_id)}
                />
                {isCenter && (
                  <div className="main_product_info">
                    <p className="main_product_name">{item.item_name}</p>
                    <p className="main_product_price">{item.item_price.toLocaleString()}원</p>
                  </div>
                )}
              </div>
            );
          })}
        </Slider>
        <div className="main_fraction-indicator">{(currentIndex % 5) + 1} / 5</div>
      </div>

      {/* ✅ 6~10번 정적 상품 */}
      <div className="main_div_static">
        {products.slice(5, 10).map(item => (
          <div className="main_img_div_static" key={item.item_origin_id}>
            <img
              className="main_div_1_img"
              src={`http://192.168.0.20:8080/${item.item_img}`}
              alt={item.item_name}
            />
            <div className="main_product_info">
              <p className="main_product_name">{item.item_name}</p>
              <p className="main_product_price">{item.item_price.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Main;
import './Main.css'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEATHER_API_KEY = '94e800adf1f9ee0e26c8130486f87568';

function Main() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [weatherLabel, setWeatherLabel] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [trendLabel, setTrendLabel] = useState('');
  const sliderRef = useRef(null);

  const isReady = products.length > 0;
  
  useEffect(() => {
    if (isReady && sliderRef.current) {
      const timer = setTimeout(() => {
        try {
          sliderRef.current.slickGoTo(0, true);
          setCurrentIndex(0);
        } catch (err) {
          console.error('슬라이더 이동 실패:', err);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  useEffect(() => {
    fetch('http://192.168.0.20:8080/item')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('상품 목록 불러오기 실패:', err));

      axios.get('http://192.168.0.20:8080/admin/discount')
      .then(res => setDiscountProducts(res.data))
      .catch(err => console.error('할인 상품 불러오기 실패:', err));
  }, []);

  //날씨 api 호출
  useEffect(() => {
  const todayKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
  const cachedForecast = localStorage.getItem('forecast');
  
  if (cachedForecast) {
    const parsed = JSON.parse(cachedForecast);
    if (parsed.date === todayKST) {
      setForecast(parsed.data);
      return;
    }
  }

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Seoul&units=metric&appid=${WEATHER_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const dailyTemps = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyTemps[date]) dailyTemps[date] = [];
        dailyTemps[date].push(item);
      });

      const processed = Object.entries(dailyTemps).map(([date, items]) => {
        const avgTemp = items.reduce((sum, i) => sum + i.main.temp, 0) / items.length;
        const min = Math.min(...items.map(i => i.main.temp_min));
        const max = Math.max(...items.map(i => i.main.temp_max));
        const icon = items[Math.floor(items.length / 2)].weather[0].icon;
        return { date, avgTemp, min, max, icon };
      });

      const todayIndex = processed.findIndex(d => d.date === todayKST);
      const sliced = todayIndex !== -1
        ? processed.slice(todayIndex, todayIndex + 5)
        : processed.slice(0, 5);

      setForecast(sliced);
      localStorage.setItem('forecast', JSON.stringify({ date: todayKST, data: sliced }));
    })
    .catch(err => console.error('날씨 데이터 오류:', err));
}, []);


  useEffect(() => {
  if (forecast.length && products.length) {
    const todayKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
    const cached = localStorage.getItem('weatherRecommendation');
    
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === todayKST) {
        setWeatherLabel(parsed.label);
        setRecommended(parsed.items);
        return;
      }
    }

    const temps = forecast.map(day => (day.max + day.min) / 2);
    const todayAvg = temps[0];
    const restAvg = temps.slice(1).reduce((a, b) => a + b, 0) / (temps.length - 1);
    const trend = todayAvg > restAvg + 1.5 ? 'up' : todayAvg < restAvg - 1.5 ? 'down' : 'stable';

    const getCategory = () => {
      if (todayAvg >= 23) return trend === 'down' ? '셔츠' : '반팔';
      if (todayAvg >= 15) return trend === 'down' ? '바람막이' : '셔츠';
      return trend === 'down' ? '니트' : '맨투맨';
    };

    const keyword = getCategory();
    setWeatherLabel(keyword);

    const filtered = products.filter(p => p.item_name.includes(keyword));
    const sliced = filtered.slice(0, 4);
    setRecommended(sliced);

    localStorage.setItem('weatherRecommendation', JSON.stringify({
      date: todayKST,
      label: keyword,
      items: sliced,
    }));
  }
}, [forecast, products]);


  const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { weekday: 'short' });
  };

  const getKSTDateStr = () => {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return kst.toISOString().split('T')[0];
  };


  const goToProductPage = (productId) => {
      navigate(`/item/${productId}`);
  };

  const PrevArrow = ({ className, style, onClick }) => (
    <div className={`${className} custom-arrow custom-prev`} style={style} onClick={onClick}>
      <ChevronLeft size={24} />
    </div>
  );

  const NextArrow = ({ className, style, onClick }) => (
    <div className={`${className} custom-arrow custom-next`} style={style} onClick={onClick}>
      <ChevronRight size={24} />
    </div>
  );

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
    {/* 상단 할인상품 슬라이더 */}
      <div className="main_div_discount" style={{marginTop:'7%'}}>
        <h3 className="main_product_slider_text" style={{marginBottom:'3%'}}>할인상품</h3>
        <Slider {...sliderSettings}>
          {discountProducts.map((item, index) => {
            const isCenter = index === currentIndex % discountProducts.length;
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
                    <p className="main_product_price">
                      <del style={{ color: '#999' }}>{item.item_price.toLocaleString()}원</del><br />
                      <span style={{ color: 'red' }}>{item.discount_rate}% </span>
                      <span style={{ color: 'black' }}>{item.discount_price.toLocaleString()}원</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </Slider>
        <div className="main_fraction-indicator">
          {(currentIndex % discountProducts.length) + 1} / {discountProducts.length}
        </div>
      </div>

      {/* 날씨 영역 */}
      {/* 날씨 배너 텍스트형 */}
{/* 날씨 텍스트 배너 (오늘이 기준이 되도록) */}
{/* 날씨 배너 전체 영역 */}
{forecast.length >= 5 && (
  <div className="weather_banner_full">
    {/* 오늘 날씨 강조 영역 */}
    <div className="today_weather_box">
      {(() => {
        const today = new Date();
        const todayStr = getKSTDateStr();
        const todayData = forecast.find(d => d.date === todayStr) || forecast[0];
        const avgTemp = (todayData.max + todayData.min) / 2;

        // 주간 온도 평균과 오늘 평균으로 추세 계산 (재사용 가능)
        const temps = forecast.map(day => (day.max + day.min) / 2);
        const restAvg = temps.slice(1).reduce((a, b) => a + b, 0) / (temps.length - 1);
        const trend = avgTemp > restAvg + 1.5 ? 'up' : avgTemp < restAvg - 1.5 ? 'down' : 'stable';

        const weekday = new Date(todayData.date).toLocaleDateString('ko-KR', { weekday: 'long' });

        return (
          <>
            <div style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '6px'}}>
              오늘 ({weekday})
            </div>
            <div style={{fontSize: '3rem'}}>
               <img src={`https://openweathermap.org/img/wn/${todayData.icon}@2x.png`} alt="날씨 아이콘" />
            </div>
            <div style={{fontSize: '1.5rem', margin: '8px 0'}}>
              {Math.round(avgTemp)}°C
            </div>
            <div style={{fontSize: '1rem', color: '#555'}}>
              최고 {Math.round(todayData.max)}° / 최저 {Math.round(todayData.min)}°
            </div>
            <div style={{marginTop: '10px', fontSize: '1rem'}}>
              기온 추세: {trend === 'up' ? '상승 ↑' : trend === 'down' ? '하락 ↓' : '안정 →'}
            </div>
          </>
        );
      })()}
    </div>

    {/* 주간 날씨 미리보기 영역 */}
    <div className="weather_week_preview">
      {forecast.map(day => {
        const dateObj = new Date(day.date);
        const isToday = day.date === getKSTDateStr();
        const avgTemp = (day.max + day.min) / 2;

        // 주간 추세는 오늘 추세와 동일하게 표시해도 무방 (또는 제외 가능)
        const temps = forecast.map(d => (d.max + d.min) / 2);
        const restAvg = temps.slice(1).reduce((a, b) => a + b, 0) / (temps.length - 1);
        const trend = avgTemp > restAvg + 1.5 ? 'up' : avgTemp < restAvg - 1.5 ? 'down' : 'stable';

        return (
          <div key={day.date} className={`weather_day_card ${isToday ? 'today' : ''}`}>
            <div style={{fontWeight: 'bold'}}>
              {dateObj.toLocaleDateString('ko-KR', { weekday: 'short' })}
            </div>
            <div style={{fontSize: '1.2rem'}}>
              <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="날씨 아이콘" />
            </div>
            <div>
              {Math.round(day.max)}° / {Math.round(day.min)}°
            </div>
          </div>
        );
      })}
    </div>
  </div>
)} 
    
      {/* 추천 상품 */}
       <div className="weather_recommend_section" style={{marginBottom:'10%'}}>
        <h3>{weatherLabel} 추천 상품</h3>
        <div className="recommend_grid">
          {recommended.map(item => (
            <div key={item.item_origin_id} className="recommend_card" onClick={() => goToProductPage(item.item_origin_id)}>
              <img src={`http://192.168.0.20:8080/${item.item_img}`} alt={item.item_name} />
              <p>{item.item_name}</p>
              <p>{item.item_price.toLocaleString()}원</p>
            </div>
          ))}
        </div>
      </div>


      {/* 정적 상품 리스트 */}
      <div className="main_div_static">
        {products.slice(5, 10).map(item => (
          <div className="main_img_div_static" key={item.item_origin_id}>
            <img
              className="main_div_1_img"
              src={`http://192.168.0.20:8080/${item.item_img}`}
              onClick={() => goToProductPage(item.item_origin_id)}
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
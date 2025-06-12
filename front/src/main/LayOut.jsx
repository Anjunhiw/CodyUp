// Layout.js
import { Outlet, useNavigate } from 'react-router-dom';
import { useState , useEffect} from 'react';
import './LayOut.css'; // 스타일 유지
import Information from './Information';

function Layout({isLoggedIn, setIsLoggedIn}) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const goToSub = (subId) => {
    navigate(`/subcategory/${subId}`);
  };

  const goToMain = () => {
    navigate('/');
  };
  
  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;
      navigate(`/item/search?keyword=${encodeURIComponent(keyword)}`);
  };

  //마이페이지 
  const goTomyPage = () =>{
    navigate('/mypage/userInfo');
  };

  //로그인, 로그아웃 

  const goToLogIn = () => {
    navigate('/Login');
  };
  const goToUser = () => {
    navigate('/User_List');
  }
  const goToProduct = () =>{
    navigate('./Product_List');
  }
  const goToOrders = () => {
    navigate('./Orders_List');
  }
  const goToSales = () => {
    navigate('./Sales_Overview');
  }
  const goToDiscount = () => {
    navigate('./Discount_List');
  }

  const handleLogout = () =>{
    setIsLoggedIn(false); //로그인 상태 끝
    sessionStorage.removeItem("user_id"); //id도 삭제
     sessionStorage.removeItem('is_admin');
    navigate('/');
  }
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const isadmin = sessionStorage.getItem("is_admin") === "1";

  useEffect(()=>{
    const storedUserId = sessionStorage.getItem("user_id");
     const storedIsAdmin = sessionStorage.getItem('is_admin');

      setUserId(storedUserId || '');
    setIsAdmin(storedIsAdmin === '1'); // '1'이면 true, 아니면 false
  }, [isLoggedIn]); // 로그인 상태가 바뀔 때마다 불러오기
  return (
    <div className="layout-wrapper">
      <div className='main_div_title'>
        <div className='main_title_row'>
          <h2 onClick={goToMain} className='main_title'>CodyUp</h2>
        
        {isLoggedIn ? (
          <div className="main_title_right_group">
            <h6 className='main_title_welcome'>{userId}{isAdmin ? " 관리자님" : " 님"} 반갑습니다!</h6>
            {!isAdmin && <button onClick={goTomyPage} className='main_title_mypage'>마이페이지</button>}
            <button onClick={handleLogout} className='main_title_logout'>로그아웃</button>
          </div>
        ) : (
          <button onClick={goToLogIn} className='main_title_right'>로그인</button>
        )}

        </div>

        <div className='main_top_menu'>
          
          {isAdmin ? (
            <>
            
              <div className='category' onClick={goToUser}>회원관리</div>
              <div className='category' onClick={goToProduct}>상품입고</div>
              <div className='category' onClick={goToOrders}>주문관리</div>
              <div className='category' onClick={goToSales}>매출현황</div>
              <div className='category' onClick={goToDiscount}>할인관리</div>
            
            </>
          ) : (
            <>
            <div className='categories'>
              <div className='category'>
                상의
                <div className='dropdown'>
                  <div onClick={() => goToSub(99)}>상의 전체</div>
                  <div onClick={() => goToSub(1)}>셔츠</div>
                  <div onClick={() => goToSub(2)}>후드</div>
                  <div onClick={() => goToSub(3)}>니트</div>
                  <div onClick={() => goToSub(4)}>반팔</div>
                </div>
              </div>
              <div className='category'>
                하의
                <div className='dropdown'>
                  <div onClick={() => goToSub(98)}>하의 전체</div>
                  <div onClick={() => goToSub(5)}>긴 바지</div>
                  <div onClick={() => goToSub(6)}>반 바지</div>
                </div>
              </div>
              </div>

              <div className='search-box'>
                <input
                  className='search-input'
                  type='text'
                  placeholder='검색어 입력'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                />
                <button className='search-button' onClick={handleSearch}>검색</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='main-content'>
        <Outlet />
      </div>
      <div className='layout_footer'>
        <Information />
      </div>
      
    </div>
  );
}

export default Layout;
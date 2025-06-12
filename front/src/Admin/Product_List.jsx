import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Product_List.css'

const Product_List = () => {
  const navigate = useNavigate();
  const [ products, setProducts ] = useState([]); //상품 리스트 저장 배열
  const [showName, setShowName] = useState(false); // 상품명 드롭다운 열림 여부
  const [showColor, setShowColor] = useState(false); // 색상 드롭다운 열기 여부
  const [showSize, setShowSize] = useState(false); // 사이즈 드롭다운 열기 여부

  const [selectProduct, setSelectProduct] = useState(null); //선택된 상품 전체
  const [selectColor, setSelectColor] = useState(null); // 선택된 색상
  const [selectSize, setSelectSize] = useState(null); //선택된 사이즈
  const [amount, setAmount] = useState(1); //입고할 수량

   useEffect(()=>{
    fetch('http://192.168.0.20:8080/admin/items')
    .then((res)=>res.json())
    .then((data)=> {
      setProducts(data);
    })
    .catch((error) => {
      console.error('상품 불러오기 실패:', error);
    });
    },[]);
     
    //드롭다운 열기/닫기 토글 함수
    const toggleName = () => setShowName(!showName);
    const toggleColor = () => setShowColor(!showColor);
    const toggleSize = () => setShowSize(!showSize);

    //상품 선택시 실행되는 함수
    const chooseProduct = (product) => {
      setSelectProduct(product); //해당 상품 저장
      setShowName(false); // 드롭다운 닫기
      setSelectColor(null); // 초기화
      setSelectSize(null);
    };

    const variants =   //JSON형식 -> JavaScript 객체
    selectProduct && JSON.parse(selectProduct.item_option)?.variants || [];

    //중복 제거 리스트 (Set: 중복을 없애주는 기능)
    const availableColor = [...new Set(variants.map((v) => v.color))];
    const availableSize = [...new Set(variants.map((v) => v.size))];

    const handleAdd = async () =>{
      if(!selectProduct || !selectColor || !selectSize || amount <= 0){
        alert('모든 항목을 선택하고, 0보다 큰 수량을 입력해주세요.');
        return;
      }
      try{
        const res = await fetch(`http://192.168.0.20:8080/admin/items/${selectProduct.item_origin_id}`,{
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({ color: selectColor,
      size: selectSize,
      amount: Number(amount) }),
        
        });

        if(res.ok){
          alert('입고 성공!');
          setAmount(0); //초기화
        } else{
          alert('입고 실패');
        }
      } catch(error){
        console.error('입고 오류:', error);
      }
    };
   
  return (
   <div>
   <table className='mainlist'>
    <thead>
      <tr>
        <th>
        
        <button className="title" onClick={toggleName}>상품명{showName ? '▲' : '▼'}</button>
        {showName && (
          <ul className='ul_Product_List'>
            {products.map(item => (
              <li
              key={item.item_origin_id} 
              onClick={()=> chooseProduct(item)}>
                  <span className='title-product-list'>{item.item_name}</span>
              </li>
            ))}
          </ul>
        )}
        <div className='title-product'>
          {selectProduct ? `${selectProduct.item_name}` : <span className='title-product-none'>선택된 상품 없음</span>}
        </div>
        </th>
        <th>
         <button className='title' onClick={toggleColor} disabled={!selectProduct}>
          색상 {showColor ? '▲' : '▼'}
          </button>
          {showColor &&(
            <ul className='ul_Product_List'>
              {availableColor.map((color) => (
                <li 
                key={color}
                onClick={()=> {
                  setSelectColor(color);
                  setShowColor(false);}}>
                    <span className='title-product-list'>{color}</span>
                </li>
              ))}
            </ul>
          )}
          <div className='title-product'>
           {selectColor ? `${selectColor}` : <span className='title-product-none'>색상 선택 필요</span>}
          </div>
        </th>
          <th>
            <button className='title' onClick={toggleSize} disabled={!selectColor}>
              사이즈 {showSize ? '▲' : '▼'}
            </button>
            {showSize && (
              <ul className='ul_Product_List'>
                {availableSize.filter((size) =>
                variants.some(
                  (v) => v.color === selectColor && v.size === size
                ) 
              )
              .map((size) =>(
                  <li key={size} onClick={() => {setSelectSize(size);
                    setShowSize(false);
                  }}>
                      <span className='title-product-list'>{size}</span>
                </li>
                ))}
              </ul>
              )}
                 <div className='title-product'>{selectSize ? selectSize : <span className='title-product-none'>사이즈 선택 필요</span>}</div>
          </th>
             <th>
           수량:{''} <input className='product-list-inp' type='number' min={0} disabled={!selectSize} value={amount} onChange={(e)=>setAmount(e.target.value)}/>
          </th>
         </tr>
         <tr className='tr_addbtn'>
          <td colSpan="4" className='td_addbtn' >
            <button className='addbtn' disabled={!selectSize} onClick={handleAdd}>입고</button>
          </td>
         </tr>
    </thead>
   </table>
   </div>
  )
   }

export default Product_List
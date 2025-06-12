import React from 'react'
import { Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ProcessPolicy = () => {

    const navigate = useNavigate();

    const goBack = () =>{
        navigate(-1);
    } 

    const goToMain = () =>{
        navigate('/');
    } 

  return (
    <div style={{display:'flex'}}>
        <div style={{ minHeight:'1600px', paddingTop:'60px' , margin:'0 auto', maxWidth:'800px', borderLeft:'1px solid #f2f2f2',borderRight:'0.5px solid #f2f2f2', padding:'0 20px'}}>
        <header
        style={{
            position:'fixed',
            top:'0',
            width:'100%',
            maxWidth:'800px',
            zIndex:'1000',
            backgroundColor:'white'
        }}
        >
            <div style={{display:'flex', height:'60px'}}>
                <button onClick={goBack} style={{border:'none', margin:'auto 0', backgroundColor:'transparent', float:'left', fontSize:'24px', fontWeight:'bold' }}>{`<`}</button>
                <div style={{margin:'auto auto', fontSize:'24px', fontWeight:'bold' }}>개인정보처리방침</div>
                <button onClick={goToMain} style={{border:'none', margin:'auto 0', backgroundColor:'transparent', float:'right', fontSize:'24px' , fontWeight:'bold' }}><Home size={24} /></button>
            </div>
        </header>
        <div style={{textAlign:'left', fontSize:'20px', lineHeight:'1.6',paddingTop:'60px'}}>
          <p>
            주식회사 codyup(이하 “회사”)는 개인정보 보호법 등 관련 법령을 준수하여 이용자의 개인정보 보호 및 권익을 보호하기 위해 최선을 다하고 있습니다.
            본 개인정보처리방침은 회사가 수집하는 개인정보의 항목, 수집 및 이용 목적, 보유 및 파기 기간 등 개인정보 처리에 관한 사항을 규정합니다.
          </p>

          <h3>1. 개인정보의 수집 항목 및 수집 방법</h3>
          <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
          <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'20px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #ccc'}}>
                <th style={{textAlign:'left', padding:'8px'}}>수집 항목</th>
                <th style={{textAlign:'left', padding:'8px'}}>수집 방법</th>
                <th style={{textAlign:'left', padding:'8px'}}>수집 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:'8px'}}>이름, 연락처, 이메일</td>
                <td style={{padding:'8px'}}>회원가입, 주문서 작성 시</td>
                <td style={{padding:'8px'}}>회원 관리, 주문 처리 및 배송</td>
              </tr>
              <tr style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:'8px'}}>주소</td>
                <td style={{padding:'8px'}}>주문서 작성 시</td>
                <td style={{padding:'8px'}}>상품 배송 및 서비스 제공</td>
              </tr>
              <tr style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:'8px'}}>로그인 정보, 접속 로그</td>
                <td style={{padding:'8px'}}>서비스 이용 과정에서 자동 수집</td>
                <td style={{padding:'8px'}}>서비스 개선 및 부정 이용 방지</td>
              </tr>
            </tbody>
          </table>

          <h3>2. 개인정보의 보유 및 이용 기간</h3>
          <p>
            회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 관련 법령에 의해 일정 기간 보관해야 하는 경우에는 해당 기간 동안 안전하게 보관합니다.
          </p>

          <h3>3. 개인정보 제3자 제공</h3>
          <p>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 배송 업체 등 서비스 제공을 위해 필요한 경우 사전에 이용자의 동의를 받거나 법령에 따라 제공할 수 있습니다.
          </p>

          <h3>4. 이용자의 권리와 행사 방법</h3>
          <p>
            이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지 등을 요청할 수 있으며, 회사는 이에 지체 없이 조치하겠습니다.
          </p>

          <h3>5. 개인정보 보호책임자</h3>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄하는 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'40px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #ccc'}}>
                <th style={{textAlign:'left', padding:'8px'}}>구분</th>
                <th style={{textAlign:'left', padding:'8px'}}>성명</th>
                <th style={{textAlign:'left', padding:'8px'}}>연락처</th>
                <th style={{textAlign:'left', padding:'8px'}}>이메일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding:'8px'}}>개인정보 보호책임자</td>
                <td style={{padding:'8px'}}>홍길동</td>
                <td style={{padding:'8px'}}>02-1234-5678</td>
                <td style={{padding:'8px'}}>privacy@musinsa.com</td>
              </tr>
            </tbody>
          </table>

          <h3>6. 개인정보 처리방침 변경</h3>
          <p>
            본 방침은 법령, 지침 및 회사 내부 방침에 따라 변경될 수 있으며, 변경 시 회사는 홈페이지를 통해 공지합니다.
          </p>
        </div>
        </div>
    </div>
  )
}

export default ProcessPolicy;
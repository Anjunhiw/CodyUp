
import React from 'react'
import { Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const LegalNotice = () => {

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
                <div style={{margin:'auto auto', fontSize:'24px', fontWeight:'bold' }}>법적 고지</div>
                <button onClick={goToMain} style={{border:'none', margin:'auto 0', backgroundColor:'transparent', float:'right', fontSize:'24px' , fontWeight:'bold' }}><Home size={24} /></button>
            </div>
        </header>
        <div style={{textAlign:'left', fontSize:'20px', lineHeight:'1.6', paddingTop:'60px'}}>
          <p>
            본 웹사이트(이하 “사이트”)에서 제공하는 모든 정보와 콘텐츠는 주식회사 codyup(이하 “회사”)의 자산이며, 저작권법 및 관련 법률에 의해 보호받습니다.
          </p>

          <h3>1. 저작권 및 지적재산권</h3>
          <p>
            사이트 내 모든 텍스트, 이미지, 디자인, 로고, 동영상 등 콘텐츠의 저작권은 회사에 있으며, 무단 복제, 배포, 전송, 출판, 변경을 금합니다.
          </p>

          <h3>2. 면책 조항</h3>
          <p>
            회사는 사이트에 게시된 정보의 정확성 및 완전성을 보장하지 않으며, 이용자가 이를 신뢰하여 발생하는 손해에 대해 법적 책임을 지지 않습니다.
          </p>

          <h3>3. 링크에 대한 책임</h3>
          <p>
            사이트 내 외부 링크는 편의 제공 목적으로만 제공되며, 해당 사이트의 내용에 대해 회사는 책임을 지지 않습니다.
          </p>

          <h3>4. 이용 제한 및 금지 사항</h3>
          <p>
            이용자는 사이트를 이용함에 있어 불법적이거나 부적절한 행위를 해서는 안 되며, 이를 위반할 경우 서비스 이용 제한 및 법적 조치가 취해질 수 있습니다.
          </p>

          <h3>5. 개인정보 보호</h3>
          <p>
            회사는 개인정보 처리방침에 따라 이용자의 개인정보를 보호하며, 개인정보 보호 관련 사항은 별도의 개인정보처리방침을 참고하시기 바랍니다.
          </p>

          <h3>6. 약관 변경 및 공지</h3>
          <p>
            본 법적 고지는 관련 법령 및 회사 정책에 따라 변경될 수 있으며, 변경 시 사이트 공지를 통해 사전에 안내합니다.
          </p>
        </div>
        </div>
    </div>
  )
}

export default LegalNotice;

import React from 'react'
import { Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const LocationPolicy = () => {

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
                <div style={{margin:'auto auto', fontSize:'24px', fontWeight:'bold'}}>위치 정보 이용 약관</div>
                <button onClick={goToMain} style={{border:'none', margin:'auto 0', backgroundColor:'transparent', float:'right', fontSize:'24px' , fontWeight:'bold' }}><Home size={24} /></button>
            </div>
        </header>
        <div style={{textAlign:'left', fontSize:'20px', lineHeight:'1.6', paddingTop:'60px'}}>
          <p>
            주식회사 codyup(이하 “회사”)는 위치 정보를 기반으로 한 맞춤형 서비스 제공을 위해 이용자의 위치 정보를 수집하고 이용합니다.
            본 약관은 위치 정보의 수집, 이용, 보관, 제3자 제공 및 이용자의 권리에 관한 내용을 안내합니다.
          </p>

          <h3>1. 위치 정보 수집 및 이용 목적</h3>
          <p>
            회사는 다음과 같은 목적으로 위치 정보를 수집 및 이용합니다:
          </p>
          <ul>
            <li>이용자에게 근처 매장 정보 제공</li>
            <li>맞춤형 광고 및 프로모션 제공</li>
            <li>서비스 개선 및 통계 분석</li>
          </ul>

          <h3>2. 위치 정보 수집 방법</h3>
          <p>
            위치 정보는 이용자가 모바일 기기 또는 웹에서 위치 정보 이용에 동의한 경우에 한해 GPS, Wi-Fi, 기지국 정보 등을 통해 수집됩니다.
          </p>

          <h3>3. 위치 정보 보유 및 이용 기간</h3>
          <p>
            수집된 위치 정보는 목적 달성 후 지체 없이 파기하며, 법령에 따라 별도로 보관해야 하는 경우에는 해당 기간 동안 안전하게 보관합니다.
          </p>

          <h3>4. 위치 정보 제3자 제공</h3>
          <p>
            회사는 이용자의 동의 없이 위치 정보를 제3자에게 제공하지 않습니다. 다만, 법령에 따른 경우나 서비스 제공을 위해 필요한 경우에 한해 제공할 수 있습니다.
          </p>

          <h3>5. 이용자의 권리 및 행사 방법</h3>
          <p>
            이용자는 위치 정보 제공에 대한 동의를 거부하거나 철회할 권리가 있으며, 동의 거부 시 위치 정보 기반 서비스 이용이 제한될 수 있습니다.
          </p>

          <h3>6. 위치 정보 보호를 위한 조치</h3>
          <p>
            회사는 위치 정보의 안전한 처리를 위해 기술적, 관리적 보호 조치를 강구하며, 무단 접근 및 유출 방지를 위해 노력합니다.
          </p>

          <h3>7. 약관 변경</h3>
          <p>
            본 약관은 법령 및 회사 정책에 따라 변경될 수 있으며, 변경 시 홈페이지에 공지하여 이용자가 쉽게 확인할 수 있도록 합니다.
          </p>
        </div>
        </div>
    </div>
  )
}

export default LocationPolicy;
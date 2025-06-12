import React from 'react'
import { Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Terms = () => {

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
                <div style={{margin:'auto auto', fontSize:'24px', fontWeight:'bold' }}>이용약관</div>
                <button onClick={goToMain} style={{border:'none', margin:'auto 0', backgroundColor:'transparent', float:'right', fontSize:'24px' , fontWeight:'bold' }}><Home size={24} /></button>
            </div>
        </header>
        <div style={{textAlign:'left', fontSize:'20px'}}>
        제1장 총칙
        <br />
        <br />
        제1조(목적) 
        <br />
        이 약관은 주식회사 codyup(이하 “회사”)가 운영하는 사이버 몰 및 매장에서 제공하는 인터넷 관련 서비스를 이용함에 있어 회사와 “이용자”의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.
        <br />
        <br />
        제2조(정의)
        <br />
        ① “몰”이란 회사가 재화 또는 용역(이하 “재화 등”)을 “이용자”에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 사이버몰을 말합니다.
        <br />
        ② “매장”이랑 회사가 재화 등을 “이용자”에게 제공하기 위하여 운영하는 오프라인 영업장 또는 공간을 말합니다.
        <br />
        ③ “이용자”란 “몰”에 접속하거나 “매장”에 방문하여 이 약관에 따라 “회사”가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
        <br />
        ④ “회원”이라 함은 “몰”에 회원 가입을 한 자로서, 계속적으로 “회사”가 제공하는 서비스를 이용할 수 있는 자를 말합니다.
        <br />
        ⑤ “비회원”이란 회원으로 가입하지 않고 “회사”가 제공하는 서비스를 이용하는 자를 말합니다.
        <br />
        ⑥ “판매자”란 “회사”와 “인터넷 쇼핑몰 입점 계약”을 체결하고 “몰”에서 재화 등을 판매하는 자를 말합니다.
        <br />
        <br />
        제3조 (약관 등의 명시와 설명 및 개정)
        <br />
        ① “회사”는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호․모사전송번호․전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자등을 “이용자”가 쉽게 알 수 있도록 ”몰”의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 “이용자”가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
        <br />
        ② “회사”는 “이용자”가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회․배송책임․환불조건 등과 같은 중요한 내용을 “이용자”가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 “이용자”의 확인을 구하여야 합니다.
        <br />
        ③ “회사”는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
        <br />
        ④ “회사”는 이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 “몰”의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지하고 “이용자”에게 통지합니다. 다만, “이용자”에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지 및 통지합니다. 이 경우 "회사“는 개정 전 내용과 개정 후 내용을 명확하게 비교하여 “이용자”가 알기 쉽도록 표시합니다.
        <br />
        ⑤ “이용자”는 개정 약관이 게시되거나 통지된 후부터 변경되는 약관의 시행일 전의 영업일까지 개정 전 약관조항에 따라 체결된 계약을 해지할 수 있고, 약관의 개정내용에 대하여 이의를 제기하지 아니하는 경우에는 약관의 개정을 승인한 것으로 봅니다.
        <br />
        ⑥ 회사는 제공하는 서비스 내의 개별 서비스에 대한 별도의 약관 또는 이용조건(이하 “타 약관”이라 한다)을 둘 수 있으며, 이 약관의 동의와는 별개로 회원에게 타 약관에 대한 동의를 받은 후 타 약관을 적용합니다. 이 경우 타 약관은 이 약관에 우선합니다.
        <br />
        ⑦ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.
        <br />
        
        .............................
        <br />
        <br />
        </div>
        </div>
    </div>
  )
}

export default Terms
    
import { useEffect, useState } from "react"
import './User_List.css'

const User_List = () => {

  const [users, setUsers] = useState([]);
  const [editIdx, setEditIdx] = useState(-1); //현재 수정중인 행 인덱스
  const [editData, setEditData] = useState({}); //수정한 데이터만 따로 저장

  useEffect(()=>{
    fetch('http://192.168.0.20:8080/admin/users')
    .then((res)=>{
      if (!res.ok) {
      return res.text().then(text => {
        throw new Error(`서버 응답 실패: ${res.status} ${res.statusText} - ${text}`);
      });
    }
    return res.json();
    })
    .then((data) => setUsers(data))
    .catch((error) => console.error('회원 목록 불러오기 실패:',error));
  },[]);

  const startEdit = (index, user) => {
    setEditIdx(index); //수정 중인 줄 기억
    setEditData({...user});
  };

  //취소 버튼(원래 상태로 돌아감 수정모드 off)
  const cancelEdit = () => {
    setEditIdx(-1);
    setEditData({});
  };

  const handleChange = (e) => {
    const{name, value} = e.target;
    setEditData(prev => ({...prev, [name]: value})); //값이 바뀌면 editData도 바뀜
  };

  //저장버튼
  const saveEdit = async () => {
    try{
      //백엔드 수정 API 호출
      const res = await fetch(`http://192.168.0.20:8080/admin/users/${editData.user_id}`,{
         method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: editData.user_name,
          user_phone_number: editData.user_phone_number
        }),
      });
        if (!res.ok) throw new Error('수정 실패');

      // 성공 시 users 배열 업데이트
      setUsers(prevUsers => prevUsers.map((u, i) => (i === editIdx ? editData : u)));

      // 수정 모드 종료
      setEditIdx(-1);
      setEditData({});
    } catch (error) {
      alert('회원 정보 수정에 실패했습니다.');
      console.error(error);
    }
  };
  const deleteUser = async (user_id) => {
    if(!window.confirm("정말 삭제하시겠습니까?")) return;

    try{
      const res =await fetch(`http://192.168.0.20:8080/admin/users/${user_id}`,{
        method: 'DELETE',
      });
      if (!res.ok) {
      if (res.status === 409) {
        alert("삭제할 수 없습니다. 작성한 리뷰 등 다른 항목이 연결되어 있습니다.");
      } else {
        alert('회원 삭제에 실패했습니다.');
      }
      return; // 함수 종료
    }

      //삭제된 회원을 목록에서 제거
      setUsers(prev => prev.filter(user => user.user_id !== user_id));
    }catch (error){
      
     alert('회원 삭제에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div>
      <table>
        <thead>
        <tr>
            <th>번호</th>
            <th>회원명</th>
            <th>ID</th>
            <th>전화번호</th>
            <th>가입일시</th>
            <th>설정</th>
        </tr>
        </thead>
        <tbody>
          {users.map((user,index) => (
        <tr key={user.user_id}>
          <td>{index+1}</td>
            <td>{user.user_id}</td>
          <td>
            {editIdx === index ? (
              <input type="text"
                    name="user_name" 
                    value={editData.user_name} 
                    onChange={handleChange}
                    />
                    ) : (
              user.user_name
                  )}
          </td>
          <td>
        {editIdx === index ? (
          <input type="text"
                  name="user_phone_number"
                  value={editData.user_phone_number}
                  onChange={handleChange}
                  />
                ) : (
          user.user_phone_number
                )}
        </td>
        <td>{user.created_at?.slice(0, 10) || '-'}</td>
        <td>
          {editIdx === index ? (
                  <>
                    <button 
                    style={{ border:'none', backgroundColor:'white', fontSize:'17px' }} 
                    onClick={saveEdit}
                    >
                      저장
                      </button>
                    <span>/</span>
                    <button 
                    style={{ border:'none', backgroundColor:'white', fontSize:'17px' }} 
                    onClick={cancelEdit}
                    >
                      취소
                      </button>
                  </>
                ) : (
                  <>
                  <button 
                  style={{ border:'none', backgroundColor:'white', fontSize:'17px' }} 
                  className="edit" 
                  onClick={() => startEdit(index, user)}
                  >수정
                  </button>
                  <span>/</span>
                  <button 
                  style={{ border:'none', backgroundColor:'white', fontSize:'17px' }} 
                  className="delete"
                  onClick={() => deleteUser(user.user_id)}
                  >
                    삭제
                    </button>
                    </>
                        )}
       </td>
    </tr>
      ))}
    </tbody>
   </table>
   </div>
  )
}

export default User_List
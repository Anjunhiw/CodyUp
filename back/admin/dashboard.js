//관리자페이지 
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/users', async (req,res)=>{
 try {
   const conn = await pool.getConnection();
   const rows = await conn.query(`
  SELECT user_id, user_name, user_phone_number, created_at
  FROM user
  WHERE is_admin = 0
  ORDER BY created_at DESC
`);
    conn.release();

    // 쿼리 결과 중 메타데이터(예: 필드정보) 제거 (mariadb 드라이버 특성)
    //실제 회원정보만 걸러내는 것
    const users = rows.filter(row => typeof row === 'object');

    res.json(users);
  } catch (err) {
    console.error('회원 목록 조회 오류:', err);
    res.status(500).json({ success: false, message: '회원 목록 조회 실패' });
  }
});

//회원 정보 수정 API
router.put('/users/:user_id', async(req,res) => {
    const {user_id} = req.params;
    const {user_name, user_phone_number} = req.body;

    try{
        const conn = await pool.getConnection();

        //쿼리로 회원 정보 업데이트
        const result = await conn.query(
            `UPDATE user SET user_name = ?, user_phone_number = ? WHERE user_id = ?`,
            [user_name, user_phone_number, user_id]
        );

        conn.release();

        if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
    }

    res.json({ message: '회원 정보가 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('회원 정보 수정 오류:', error);
    res.status(500).json({ message: '서버 오류로 수정에 실패했습니다.' });
    }
});

//회원 삭제 API
router.delete('/users/:user_id', async (req,res) => {
    const {user_id} = req.params;

    try{
        const conn = await pool.getConnection();
        const result = await conn.query(
            `DELETE FROM user WHERE user_id =?`,
            [user_id]
        );
        conn.release();

        if(result.affectedRows === 0){
            return res.status(404).json({message: '삭제할 회원을 찾을 수 없습니다.'});
        }
        res.json({message: '회원이 성공적으로 삭제되었습니다.'});
    }   catch(error){
        if (error.errno === 1451) {
            res.status(409).json({
            success: false,
            message: "회원 데이터가 다른 항목에 연결되어 있어 삭제할 수 없습니다.",
            });
        }   else {
            console.error('회원 삭제 오류:', error);
            res.status(500).json({message: '서버 오류로 삭제에 실패했습니다.'});
        }
    }
})

module.exports = router;

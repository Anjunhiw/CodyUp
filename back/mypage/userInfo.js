const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결 풀 불러오기 (경로는 상황에 맞게 조절)

// POST /mypage/userinfo
router.post('/userinfo', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'user_id가 필요합니다.' });
  }

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT user_id, user_password, user_name FROM user WHERE user_id = ?',
      [user_id]
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('DB 조회 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});



module.exports = router;

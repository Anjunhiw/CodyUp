const express = require('express');
const router = express.Router();
const pool = require('../db');

// PATCH /mypage/update-password
router.patch('/update-password', async (req, res) => {
  const { user_id, current_password, new_password } = req.body;

  if (!user_id || !current_password || !new_password) {
    return res.status(400).json({ success: false, message: '필수 정보 누락' });
  }

  try {
    const conn = await pool.getConnection();

    // 1. 기존 비밀번호 확인
    const userRows = await conn.query(
      'SELECT user_password FROM user WHERE user_id = ?',
      [user_id]
    );

    if (userRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: '사용자 없음' });
    }

    const storedPassword = userRows[0].user_password;

    // 2. 비밀번호 비교 (현재는 평문 비교, 해시 처리 시 bcrypt.compare 사용)
    console.log(`입력한 기존 비밀번호: ${current_password}`);
    console.log(`DB에 저장된 비밀번호: ${storedPassword}`);

    if (storedPassword !== current_password) {
      conn.release();
      return res.status(401).json({ success: false, message: '기존 비밀번호 불일치' });
    }

    // 3. 비밀번호 업데이트
    const updateResult = await conn.query(
    'UPDATE user SET user_password = ? WHERE user_id = ?',
    [new_password, user_id]
    );

    conn.release();

    res.json({ success: true, message: '비밀번호 변경 성공' });
  } catch (err) {
    console.error('비밀번호 변경 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;
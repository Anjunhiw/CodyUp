const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs'); // bcrypt 추가

// PATCH /mypage/update-password
router.patch('/update-password', async (req, res) => {
  const { user_id, current_password, new_password } = req.body;

  if (!user_id || !current_password || !new_password) {
    return res.status(400).json({ success: false, message: '필수 정보 누락' });
  }

  try {
    const conn = await pool.getConnection();

    // 1. DB에서 사용자 비밀번호 조회
    const userRows = await conn.query(
      'SELECT user_password FROM user WHERE user_id = ?',
      [user_id]
    );

    if (userRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: '사용자 없음' });
    }

    const storedHashedPassword = userRows[0].user_password;

    // 2. 기존 비밀번호 비교 (bcrypt)
    const isMatch = await bcrypt.compare(current_password, storedHashedPassword);
    if (!isMatch) {
      conn.release();
      return res.status(401).json({ success: false, message: '기존 비밀번호 불일치' });
    }

    // 3. 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // 4. DB 업데이트
    await conn.query(
      'UPDATE user SET user_password = ? WHERE user_id = ?',
      [hashedNewPassword, user_id]
    );

    conn.release();
    res.json({ success: true, message: '비밀번호 변경 성공' });

  } catch (err) {
    console.error('비밀번호 변경 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;

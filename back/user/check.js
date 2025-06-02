const express = require('express');
const router = express.Router();
const pool = require('../db');

// 아이디 중복 검사
router.post('/id', async (req, res) => {
  const { user_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT user_id FROM user WHERE user_id = ?',
      [user_id]
    );
    conn.release();
    if (rows.length > 0) {
      return res.json({ success: false, message: '이미 존재하는 아이디입니다.' });
    } else {
      return res.json({ success: true, message: '사용 가능한 아이디입니다.' });
    }
  } catch (err) {
    console.error('아이디 중복 검사 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 휴대폰 번호 중복 검사
router.post('/phone', async (req, res) => {
  const { user_phone_number } = req.body;

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT user_phone_number FROM user WHERE user_phone_number = ?',
      [user_phone_number]
    );
    conn.release();

    if (rows.length > 0) {
      return res.json({ success: false, message: '이미 등록된 휴대폰 번호입니다.' });
    } else {
      return res.json({ success: true, message: '사용 가능한 번호입니다.' });
    }
  } catch (err) {
    console.error('휴대폰 중복 검사 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;
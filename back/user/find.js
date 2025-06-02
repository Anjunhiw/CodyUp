const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/find-id', async (req, res) => {
  const { user_name, user_phone_number } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT user_id FROM user WHERE user_name = ? AND user_phone_number = ?',
      [user_name, user_phone_number]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '일치하는 회원이 없습니다.' });
    }
    res.json({ success: true, user_id: rows[0].user_id });
  } catch (err) {
    console.error('아이디 찾기 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  } finally {
    if (conn) conn.release();
  }
});

router.post('/find-password', async (req, res) => {
  const { user_id, user_name } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT user_password FROM user WHERE user_id = ? AND user_name = ?',
      [user_id, user_name]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '일치하는 회원이 없습니다.' });
    }
    res.json({ success: true, user_password: rows[0].user_password });
  } catch (err) {
    console.error('비밀번호 찾기 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
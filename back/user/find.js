const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs'); // bcrypt 추가

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

    // 유저 확인
    const rows = await conn.query(
      'SELECT user_id FROM user WHERE user_id = ? AND user_name = ?',
      [user_id, user_name]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '일치하는 회원이 없습니다.' });
    }

    // 임시 비밀번호 생성
    const tempPassword = Math.random().toString(36).slice(-8) + "!"; // 예: 8자리 + 특수문자
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    //console.log(tempPassword);
    // DB 업데이트
    await conn.query(
      'UPDATE user SET user_password = ? WHERE user_id = ?',
      [hashedTempPassword, user_id]
    );

    // 사용자에게 임시 비밀번호 전달
    res.json({ success: true, temp_password: tempPassword });
  } catch (err) {
    console.error('임시 비밀번호 발급 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
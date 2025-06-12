const express = require('express');
const router = express.Router();
const pool = require('../db');  
const bcrypt = require('bcryptjs');

// POST /join 요청 처리
router.post('/', async (req, res) => {
  const { user_id, user_password, user_name, user_phone_number } = req.body;

  try {
    const conn = await pool.getConnection();
    
    const hashedPassword = await bcrypt.hash(user_password, 10); // 10 = saltRounds

    // 2. 회원가입진행
    const query = `
      INSERT INTO user (user_id, user_password, user_name, user_phone_number)
      VALUES (?, ?, ?, ?)
    `;
    const result = await conn.query(query, [
      user_id,
      hashedPassword,
      user_name,
      user_phone_number
    ]);

    conn.release();

    res.json({
      success: true,
      message: '회원가입 성공',
      insertedId: Number(result.insertId)
    });

  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ success: false, message: '회원가입 실패' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /mypage/orders/:user_id
router.get('/orders/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      'SELECT * FROM `order` WHERE user_id = ? ORDER BY order_date DESC',
      [user_id]
    );
    res.json({ success: true, orders: rows });
  } catch (err) {
    console.error('주문내역 조회 오류:', err);
    res.status(500).json({ success: false, message: '주문내역 조회 실패' });
  } finally {
    conn.release();
  }
});

module.exports = router;
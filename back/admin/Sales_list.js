const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/sales', async (req, res) => {
  const { date } = req.query;

  // 날짜가 없으면 400 에러
  if (!date) {
    return res.status(400).json({ message: '날짜가 필요합니다.' });
  }

  try {
    const conn = await pool.getConnection();

    // 날짜 기준으로 데이터 조회
    const query = "SELECT order_date, order_option, total_price, COUNT(*)  FROM `order` WHERE DATE(order_date) = ? AND status = '결제완료'";
    const rows = await conn.query(query, [date]);
    conn.release();

    let totalQuantity = 0;
    let totalPrice = 0;

    //.log(String(rows[0]["COUNT(*)"]).match(/\d{1,}/)[0]);
    for (const row of rows) {
        try{
         
        const parsed = JSON.parse(row.order_option); // 문자열 → 객체
        parsed.forEach(item => {
            totalQuantity += item.quantity || 0; 
        });
        totalPrice += parseFloat(row.total_price) || 0;
    }catch (err) {
        console.error('order_option 파싱 오류:', err);
      }
    }
    
     
    res.json({
        order_date: date,
        order_option: { quantity: totalQuantity },
        total_price: totalPrice,
      });
  } catch (error) {
    console.error('매출 조회 오류:', error);
    res.status(500).json({ message: '매출 조회 실패' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/orders', async (req,res)=>{
      try {
        const conn = await pool.getConnection();
        const query = 'SELECT order_date, order_option, total_price FROM `order`';
        const rows = await conn.query(query);
        conn.release();
       
        res.json(rows);
        console.log(rows)
    } catch (error) {
        console.error('매출 조회 오류', error);
        res.status(500).json({ message: '매출 조회 실패' });
    }
})

module.exports = router;
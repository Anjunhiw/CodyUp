const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/orders', async (req,res) => {
    try{
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM `order`');
        conn.release();
        res.json(rows);
    } catch(error){
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

router.patch('/:id/cancel', async(req,res) => {
    const orderId = req.params.id;

    try{
        const conn = await pool.getConnection();
        const result = await conn.query(
            'UPDATE `order` SET status = ? WHERE order_id = ?',
            ['주문 취소', orderId]
        );
        conn.release();
        if(result.affectedRows === 0) {
            return res.status(404).json({message: '해당 주문을 찾을 수 없습니다.'})
        }
        res.json({message:'주문이 취소되었습니다.'});
    } catch(error) {
        console.error('주문 취소 중 오류:', error);
        res.status(500).json({message:'서버 오류'});
    }
})

module.exports = router;
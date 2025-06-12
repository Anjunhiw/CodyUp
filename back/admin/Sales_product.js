const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/sales/product', async (req,res) => {
    const {name} = req.query;

    if(!name) {
        return res.status(400).json({message: '상품명이 필요합니다.'});
    }
    try{
        const conn = await pool.getConnection();

        const query = "SELECT order_option, total_price  FROM `order` WHERE status = '결제완료'";
        const rows = await conn.query(query);
        conn.release();

        let totalQuantity = 0;
        let totalPrice = 0;

        for (const row of rows) {
            try{
                const options = JSON.parse(row.order_option);
                options.forEach(item => {
                    if(item.item_name === name){
                    totalQuantity += item.quantity || 0;
                    totalPrice += parseFloat(row.total_price) || 0;
                    }
                });
            } catch(err) {
                console.error('order_option 파싱 오류:', err);
            }
        }
        res.json({
            order_option:{
                item_name: name,
                quantity: totalQuantity
            },
            total_price: totalPrice
        });
        
    } catch(error){
        console.error('매출 조회 오류:', error);
        res.status(500).json({message: '매출 조회 실패'});
    }
});

module.exports = router;
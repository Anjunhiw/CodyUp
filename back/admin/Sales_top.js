const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/sales/rank', async (req,res) => {
    try{
     const rows= await pool.query(
        "SELECT order_option FROM `order` WHERE status = '결제완료'"
        );

    const orders = rows || [];  // rows가 없을 경우 빈 배열 할당

    //누적할 Map 생성   
    const quantityMap = new Map();
    const salesMap = new Map();
    
    //순회하면서 누적 처리
    for (const order of orders) {
     try {
    const options = JSON.parse(order.order_option); 

    for (const opt of options) {
      const itemName = opt.item_name;
      const quantity = Number(opt.quantity) || 0;
      const price = Number(opt.price) || 0;
      const total = quantity * price;

      quantityMap.set(itemName, (quantityMap.get(itemName) || 0) + quantity);
      salesMap.set(itemName, (salesMap.get(itemName) || 0) + total);
    }
  } catch (parseError) {
    console.error('JSON 파싱 실패:', order.order_option);
    console.error(parseError);
  }
}
        //TOP5 추출 (entries: 배열로 변환)
            const byQuantity = [...quantityMap.entries()]
            .sort((a,b) => b[1] - a[1])
            .slice(0,5)
            .map(([item_name, quantity], index) => ({
                item_name,
                quantity,
                by_quantity: index + 1,
            }));
                // 매출 기준
                const bySales = [...salesMap.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([item_name, total_price], index) => ({
                    item_name,
                    total_price,
                    by_sales: index + 1,
             }));
             //두 순위 병합
             const resultMap = new Map();

             byQuantity.forEach(item => {
                resultMap.set(item.item_name, {
                    item_name: item.item_name,
                    quantity: item.quantity,
                    by_quantity: item.by_quantity,
                });
             });
             //상품이 TOP에 없다면 새로 넣어줌
             bySales.forEach(item => {
                if(!resultMap.has(item.item_name)) {
                    resultMap.set(item.item_name, {item_name: item.item_name});
                }
                //이미 있는 경우 기존 객체에 추가해 병합
                const existing = resultMap.get(item.item_name);
                existing.total_price = item.total_price;
                existing.by_sales = item.by_sales;
             });
            //최종 결과 전송
            res.json([...resultMap.values()]);

    }  catch (error) {
            console.error('판매 순위 조회 오류:', error);
            res.status(500).json({error: '서버 오류'});
        }
});

module.exports = router;
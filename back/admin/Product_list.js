const express = require('express');
const router = express.Router();
const pool = require('../db');

//상품 불러오기
router.get('/items', async (req, res)=>{
    try{
        const conn = await pool.getConnection();
       const rows = await conn.query(`
           SELECT item_origin_id, item_name, item_option
      FROM item`
);
            

            conn.release();
    
             // 쿼리 결과 중 메타데이터(예: 필드정보) 제거 (mariadb 드라이버 특성)
             //실제 회원정보만 걸러내는 것
            const items = rows.filter(row => typeof row ==='object');
        
            res.json(items)       
}
            catch(error){
        console.error('상품 목록 조회 오류', error);
        res.status(500).json({message: '상품 목록 조회 실패'});
    }
});

//입고 수량 불러오기
router.post('/items/:item_origin_id', async(req,res) => {
    const {item_origin_id} = req.params;
    const {color, size, amount} = req.body;

    try{
        const conn = await pool.getConnection();

        //1.기존 item_option JSON 조회
        const rows = await conn.query(
           'SELECT item_origin_id, item_name, item_option FROM item WHERE item_origin_id = ?',

            [item_origin_id]
        );
        
        if(rows.length === 0){
            conn.release();
            return res.status(404).json({error: '상품 없음'});
        }

        //2. JSON 파싱
        let item_option = JSON.parse(rows[0].item_option);
        const jsonStr = rows[0].item_option;
try {
  const item_option = JSON.parse(jsonStr);
  console.log('JSON 파싱 성공:', item_option);
} catch(e) {
  console.error('JSON 파싱 실패:', e.message);
}


        //3. variants 배열에서 해당 색상, 사이즈 찾기
        const variant = item_option.variants.find(v => v.color === color && v.size === size);

        if (!variant) {
      conn.release();
      return res.status(404).json({ error: '해당 옵션 없음' });
    }

        //4. amount 업데이트 (기존 수량 + 입고 수량)
        variant.amount = (variant.amount || 0) + Number (amount);

        //5. 수정된 JSON 다시 문자열로 반환
        const newItemOptionStr = JSON.stringify(item_option);

        //6. DB 업데이트
         await conn.query(
            `UPDATE item SET item_option = ?
            WHERE item_origin_id = ?`,
            [newItemOptionStr, item_origin_id]
        );

        conn.release();
         res.json({ success: true, message: '수량 업데이트 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
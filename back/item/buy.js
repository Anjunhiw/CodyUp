const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /buy
router.post('/buy', async (req, res) => {
  const { item_origin_id, item_amount, item_size, item_color } = req.body;

  if (!item_origin_id || !item_amount || item_amount <= 0 || !item_size || !item_color) {
    return res.status(400).json({ success: false, message: '유효하지 않은 요청입니다.' });
  }

  try {
    const conn = await pool.getConnection();

    // 1. item_option 가져오기
    const rows = await conn.query(
      'SELECT item_option FROM item WHERE item_origin_id = ?',
      [item_origin_id]
    );

    if (rows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
    }

    const itemOption = JSON.parse(rows[0].item_option);

    // 2. variants 배열에서 해당 옵션 찾기
    const variantIndex = itemOption.variants.findIndex(
      (v) => v.size === item_size && v.color === item_color
    );

    if (variantIndex === -1) {
      conn.release();
      return res.status(404).json({ success: false, message: '해당 옵션을 찾을 수 없습니다.' });
    }

    const currentStock = itemOption.variants[variantIndex].amount;

    // 3. 재고 확인
    if (item_amount > currentStock) {
      conn.release();
      return res.json({
        success: false,
        message: `재고 부족: 현재 수량은 ${currentStock}개입니다.`
      });
    }

    // 4. 수량 차감
    itemOption.variants[variantIndex].amount -= item_amount;

    // 5. JSON 문자열로 다시 저장
    await conn.query(
      'UPDATE item SET item_option = ? WHERE item_origin_id = ?',
      [JSON.stringify(itemOption), item_origin_id]
    );

    conn.release();

    return res.json({
      success: true,
      message: `구매 완료! 남은 수량: ${itemOption.variants[variantIndex].amount}개`
    });

  } catch (err) {
    console.error('구매 처리 오류:', err);
    return res.status(500).json({ success: false, message: '서버 오류로 구매에 실패했습니다.' });
  }
});

module.exports = router;

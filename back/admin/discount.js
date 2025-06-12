const express = require('express');
const router = express.Router();
const pool = require('../db'); // 경로 확인 필요

//전체 상품 목록
router.get('/all-items', async (req, res) => {
  try {
    const rows = await pool.query(`SELECT item_origin_id, item_name FROM item`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

//할인 상품 조회
router.get('/discount', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT item_origin_id, item_name, item_price, item_img, discount_rate, discount_price
      FROM item
      WHERE discount_rate > 0
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

// 할인 등록
router.patch('/discount/apply', async (req, res) => {
  const { item_origin_id, discount_rate } = req.body;

  if (!item_origin_id || discount_rate == null) {
    return res.status(400).json({ success: false, message: '필수 값 누락' });
  }

  try {
    const conn = await pool.getConnection();

    // 기존 가격 조회
    const item = await conn.query(
      'SELECT item_price FROM item WHERE item_origin_id = ?',
      [item_origin_id]
    );

    if (item.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
    }

    const item_price = item[0].item_price;
    const discount_price = Math.floor(item_price * (1 - discount_rate / 100));

    // 할인 적용
    await conn.query(
      'UPDATE item SET discount_rate = ?, discount_price = ? WHERE item_origin_id = ?',
      [discount_rate, discount_price, item_origin_id]
    );

    conn.release();
    res.json({ success: true, message: `${discount_rate}% 할인 적용 완료` });
  } catch (err) {
    console.error('할인 등록 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 할인 초기화
router.patch('/reset', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    await conn.query(
      'UPDATE item SET discount_rate = 0, discount_price = 0'
    );

    conn.release();
    res.json({ success: true, message: '모든 상품의 할인 정보가 초기화되었습니다.' });
  } catch (err) {
    console.error('할인 초기화 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});


module.exports = router;
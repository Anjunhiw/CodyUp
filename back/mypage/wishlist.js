const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결 풀 불러오기 (경로는 상황에 맞게 조절)

//찜하기 
router.post('/wishlist', async (req, res) => {
  const { user_id, item_origin_id } = req.body;

  if (!user_id || !item_origin_id) {
    return res.status(400).json({ success: false, message: '필수 정보 누락' });
  }

  const conn = await pool.getConnection();
  try {
    // 중복 방지
    const exists = await conn.query(
      'SELECT * FROM wishlist WHERE user_id = ? AND item_origin_id = ?',
      [user_id, item_origin_id]
    );
    
    if (exists.length > 0) {
      return res.status(409).json({ success: false, message: '이미 찜한 상품입니다.' });
    }
    //console.log(exists);
    await conn.query(
      'INSERT INTO wishlist (user_id, item_origin_id) VALUES (?, ?)',
      [user_id, item_origin_id]
    );

    res.json({ success: true, message: '찜 등록 성공' });
  } catch (err) {
    console.error('찜 등록 실패:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  } finally {
    conn.release();
  }
});

router.delete('/wishlist', async (req, res) => {
  const { user_id, item_origin_id } = req.body;

  if (!user_id || !item_origin_id) {
    return res.status(400).json({ success: false, message: '필수 정보 누락' });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      'DELETE FROM wishlist WHERE user_id = ? AND item_origin_id = ?',
      [user_id, item_origin_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '찜 내역이 없습니다.' });
    }

    res.json({ success: true, message: '찜 해제 성공' });
  } catch (err) {
    console.error('찜 해제 실패:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  } finally {
    conn.release();
  }
});

// get mypage/wishlist/:user_id
router.get('/wishlist/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(`
      SELECT w.item_origin_id, w.added_at, i.item_name, i.item_price, i.discount_rate, i.discount_price, i.item_img
      FROM wishlist w
      JOIN item i ON w.item_origin_id = i.item_origin_id
      WHERE w.user_id = ?
      ORDER BY w.added_at DESC
    `, [user_id]);

    res.json({ success: true, wishlist: rows });
  } catch (err) {
    console.error('찜 목록 조회 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  } finally {
    conn.release();
  }
});

module.exports = router;

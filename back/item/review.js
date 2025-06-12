const express = require('express');
const router = express.Router();
const pool = require('../db');  


// 1. 특정 상품의 리뷰 전체 조회
router.get('/:item_id', async (req, res) => {
  const { item_id } = req.params;
  try {
    const reviews = await pool.query(
      'SELECT * FROM review WHERE item_id = ? ORDER BY created_at DESC',
      [item_id]
    );
    res.json({
      reviews, // ✅ 배열 그대로 전달
      reviewCount: reviews.length
    });

  } catch (err) {
    console.error('리뷰 조회 오류:', err);
    res.status(500).json({ message: '리뷰 조회 실패' });
  }
});

// 2. 리뷰 작성
router.post('/', async (req, res) => {
  const { user_id, item_id, review_content, rating } = req.body;

  if (!user_id || !item_id || !review_content || rating == null) {
    return res.status(400).json({ message: "필수 값 누락" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO review (user_id, item_id, review_content, rating) VALUES (?, ?, ?,?)',
      [user_id, item_id, review_content, rating]
    );

    const insertedId = result.insertId;

    const [newReview] = await pool.query(
      'SELECT * FROM review WHERE review_id = ?',
      [insertedId]
    );

    res.json(newReview[0]); // 등록된 리뷰 내용을 프론트로 반환
  } catch (err) {
    console.error('리뷰 등록 오류:', err);
    res.status(500).json({ message: '리뷰 등록 실패' });
  }
});


// 3. 리뷰 수정
router.put('/:review_id', async (req, res) => {
  const { review_id } = req.params;
  const { review_content, rating} = req.body;
  try {
    await pool.query(
      'UPDATE review SET review_content = ?, rating = ? WHERE review_id = ?',
      [review_content, rating, review_id]
    );
    res.json({ message: '리뷰 수정 성공' });
  } catch (err) {
    console.error('리뷰 수정 오류:', err);
    res.status(500).json({ message: '리뷰 수정 실패' });
  }
});


// 4. 리뷰 삭제
router.delete('/:review_id', async (req, res) => {
  const { review_id } = req.params;
  try {
    await pool.query('DELETE FROM review WHERE review_id = ?', [review_id]);
    res.json({ message: '리뷰 삭제 성공' });
  } catch (err) {
    console.error('리뷰 삭제 오류:', err);
    res.status(500).json({ message: '리뷰 삭제 실패' });
  }
});


module.exports = router;
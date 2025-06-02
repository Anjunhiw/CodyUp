const express = require('express');
const router = express.Router();
const pool = require('../db');  
const multer = require('multer');
const path = require('path');

// 전체 상품 목록 조회
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM item");
    res.json(rows);
  } catch (err) {
    console.error("상품 전체 조회 오류:", err);
    res.status(500).json({ message: '상품 불러오기 실패' });
  } finally {
    if (conn) conn.release(); // ✅ 무조건 반환
  }
});

//최근 상품 불러오기 조회
router.get('/recent', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT item_origin_id AS id, item_name AS name
      FROM item
      ORDER BY item_origin_id DESC
      LIMIT 10
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error('최근 상품 불러오기 오류:', err);
    res.status(500).json({ message: '최근 상품 조회 실패' });
  }
});

// 검색 기능
router.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ message: '검색어가 없습니다.' });
  }

  try {
    const rows = await pool.query(
      `SELECT * FROM item WHERE item_name LIKE ?`,
      [`%${keyword}%`]
    );
    //console.log("검색 결과:", rows);
    res.json(rows);
  } catch (err) {
    console.error('검색 오류:', err);
    res.status(500).json({ message: '검색 실패' });
  }
});




// ✅ 상품 1개 조회 (프론트의 /item/1 요청 처리)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM item WHERE item_origin_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("상품 상세 조회 오류:", err);
    res.status(500).json({ message: '상품 조회 실패' });
  } finally {
    if (conn) conn.release(); // ✅ 여기서 무조건 해제
  }
});


// 저장 경로 설정
const storage = multer.diskStorage({
  destination:  path.join(__dirname, '../../img'),  // 상위 상위 img 폴더로 이동
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // 고유 파일명
  }
});


const upload = multer({ storage });

// 정적 파일 서비스 (이미지 보여줄 수 있게)
//router.use('/img', express.static(path.join(__dirname, '../../img')));

module.exports = router;
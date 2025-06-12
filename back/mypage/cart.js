const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. 장바구니 목록 조회
router.get('/cart/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT c.cart_id, c.item_origin_id, i.item_name, i.item_price, i.discount_rate, i.discount_price, i.item_img ,c.cart_option
      FROM cart c
      JOIN item i ON c.item_origin_id = i.item_origin_id
      WHERE c.user_id = ?
    `, [user_id]);
    conn.release();

    res.json({ success: true, cart: rows });
  } catch (err) {
    console.error('장바구니 조회 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 2. 장바구니에 상품 추가
router.post('/cart', async (req, res) => {
  const { user_id, item_origin_id, quantity } = req.body;

  try {
    const conn = await pool.getConnection();

    // 중복 여부 확인
    const [existing] = await conn.query(
      'SELECT * FROM cart WHERE user_id = ? AND item_origin_id = ?',
      [user_id, item_origin_id]
    );

    if (existing.length > 0) {
      // 이미 있는 경우 수량 업데이트
      await conn.query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_origin_id = ?',
        [quantity, user_id, item_origin_id]
      );
    } else {
      // 없으면 새로 추가
      await conn.query(
        'INSERT INTO cart (user_id, item_origin_id, quantity) VALUES (?, ?, ?)',
        [user_id, item_origin_id, quantity]
      );
    }

    conn.release();
    res.json({ success: true, message: '장바구니에 추가되었습니다.' });
  } catch (err) {
    console.error('장바구니 추가 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 3. 장바구니 항목 삭제
router.delete('/cart/:cart_id', async (req, res) => {
  const { cart_id } = req.params;

  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM cart WHERE cart_id = ?', [cart_id]);
    conn.release();

    res.json({ success: true, message: '장바구니 항목 삭제됨' });
  } catch (err) {
    console.error('장바구니 삭제 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 4. 장바구니 수량 수정
router.patch('/cart/:cart_id', async (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;

  try {
    const conn = await pool.getConnection();

    // 기존 cart_option 불러오기
    const result = await conn.query('SELECT cart_option FROM cart WHERE cart_id = ?', [cart_id]);
    if (result.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: '장바구니 항목을 찾을 수 없습니다.' });
    }

    // 기존 옵션에서 quantity만 수정
    const oldOption = JSON.parse(result[0].cart_option || '{}');
    const updatedOption = { ...oldOption, quantity };

    // 수정된 옵션 저장
    await conn.query('UPDATE cart SET cart_option = ? WHERE cart_id = ?', [JSON.stringify(updatedOption), cart_id]);
    conn.release();

    res.json({ success: true, message: '수량이 수정되었습니다.' });
  } catch (err) {
    console.error('수량 수정 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 5. 장바구니 추가 
router.post('/cart/add', async (req, res) => {
  const { user_id, item_origin_id, cart_option } = req.body;

  const color = cart_option?.color;
  const size = cart_option?.size;
  const quantity = cart_option?.quantity;

  if (!color || !size || !quantity) {
    return res.status(400).json({ success: false, message: '옵션(color, size, quantity) 누락됨' });
  }

  try {
    const conn = await pool.getConnection();

    // 1. 상품 가격 및 할인 정보 조회
    const rows = await conn.query(
      'SELECT item_price, discount_price, discount_rate FROM item WHERE item_origin_id = ?',
      [item_origin_id]
    );

    if (!rows || rows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
    }

    const { item_price, discount_price, discount_rate } = rows[0];
    const final_price = discount_rate > 0 ? discount_price : item_price;

    // 2. 기존 장바구니에 동일 옵션의 상품이 있는지 확인
    const existing = await conn.query(
      `SELECT * FROM cart 
       WHERE user_id = ? AND item_origin_id = ? 
       AND JSON_UNQUOTE(JSON_EXTRACT(cart_option, "$.color")) = ? 
       AND JSON_UNQUOTE(JSON_EXTRACT(cart_option, "$.size")) = ?`,
      [user_id, item_origin_id, color, size]
    );

    if (existing.length > 0) {
      // 기존 수량 가져오기
      const currentOption = JSON.parse(existing[0].cart_option);
      const newQuantity = currentOption.quantity + quantity;

      const newOptionJson = JSON.stringify({
        color,
        size,
        quantity: newQuantity
      });

      // 수량과 옵션 JSON 덮어쓰기
      await conn.query(
        `UPDATE cart 
         SET cart_option = ?, price = ? 
         WHERE user_id = ? AND item_origin_id = ? 
         AND JSON_UNQUOTE(JSON_EXTRACT(cart_option, "$.color")) = ? 
         AND JSON_UNQUOTE(JSON_EXTRACT(cart_option, "$.size")) = ?`,
        [newOptionJson, final_price, user_id, item_origin_id, color, size]
      );
    } else {
      // 없으면 새로 추가
      const optionJson = JSON.stringify({ color, size, quantity });

      await conn.query(
        `INSERT INTO cart (user_id, item_origin_id, price, cart_option) 
         VALUES (?, ?, ?, ?)`,
        [user_id, item_origin_id, final_price, optionJson]
      );
    }

    conn.release();
    res.json({ success: true, message: '장바구니에 추가되었습니다.' });
  } catch (err) {
    console.error('장바구니 추가 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});



// 6. 장바구니 상품 주문 
router.post('/cart/order', async (req, res) => {
  const { user_id, order_items } = req.body;

  if (!user_id || !Array.isArray(order_items) || order_items.length === 0) {
    return res.status(400).json({ success: false, message: '유효하지 않은 요청입니다.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let totalPrice = 0;
    const orderOptions = [];

    for (const item of order_items) {
      const { cart_id, item_origin_id, quantity, color, size } = item;

      const itemRows = await conn.query(
        'SELECT item_name, item_option, item_price, discount_rate, discount_price FROM item WHERE item_origin_id = ?',
        [item_origin_id]
      );
      //console.log(itemRows[0]);
      if (!itemRows || itemRows.length === 0) {
        console.log("상품 없음:", item_origin_id);
        continue;
      }

      const itemName = itemRows[0].item_name;

      const itemPrice = itemRows[0].discount_rate > 0 ? itemRows[0].discount_price : itemRows[0].item_price;
      let itemOption;
      try {
        itemOption = JSON.parse(itemRows[0].item_option);
      } catch (e) {
        console.log("item_option JSON 파싱 실패:", itemRows[0].item_option);
        continue;
      }  

    const variant = itemOption.variants?.find(
        (v) => v.size === size && v.color === color
    );
    if (!variant) {
      console.log("❌ 옵션 매칭 실패:", { item_origin_id, size, color });
      continue;
    }

    if (itemPrice === undefined || isNaN(itemPrice)) {
      console.log("❌ 가격 없음 또는 이상함:", itemPrice);
      continue;
    }

    const price = Number(itemPrice) * Number(quantity);
    if (isNaN(price)) {
      console.log("❌ 계산된 price가 NaN:", { variant, quantity });
      continue;
    }
      totalPrice += price;

      orderOptions.push({
        product_id: item_origin_id,
        item_name: itemName,
        size,
        color,
        quantity,
        price
      });

      variant.amount -= quantity;
      await conn.query(
        'UPDATE item SET item_option = ? WHERE item_origin_id = ?',
        [JSON.stringify(itemOption), item_origin_id]
      );

      await conn.query('DELETE FROM cart WHERE cart_id = ?', [cart_id]);
    }

    // 주문 저장
    await conn.query(
      'INSERT INTO `order` (user_id, order_option, total_price, status) VALUES (?, ?, ?, ?)',
      [user_id, JSON.stringify(orderOptions), totalPrice, '결제완료']
    );

    await conn.commit();
    res.json({ success: true, message: '주문이 완료되었습니다.' });
  } catch (err) {
    await conn.rollback();
    console.error('장바구니 주문 처리 오류:', err);
    res.status(500).json({ success: false, message: '주문 처리 중 오류 발생' });
  } finally {
    conn.release();
  }
});


module.exports = router;

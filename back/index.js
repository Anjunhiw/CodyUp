const express = require('express');
const cors = require('cors');
const app = express();

const joinRouter = require('./user/join');
const checkRouter = require('./user/check');
const loginRouter = require('./user/login');
const findRouter = require('./user/find');
const itemRouter = require('./item/show');
const buyRouter = require('./item/buy');
const reviewRouter = require('./item/review');
const adminRouter = require('./admin/dashboard');
const productRouter = require('./admin/Product_list');
const ordersRouter = require('./admin/Orders_list');
const salesRouter = require('./admin/Sales_list');
const salesproductRouter = require('./admin/Sales_product');
const salestop5Router = require('./admin/Sales_top');
const admin_discountRouter = require('./admin/discount');
const mypageRouter = require('./mypage/userInfo');
const updateRouter = require('./mypage/updatePassword');
const cartRouter = require('./mypage/cart');
const wishlistRouter = require('./mypage/wishlist');
const MyOrderRouter = require('./mypage/orderlist');
const path = require('path');

app.use(cors());
app.use(express.json());


app.use((req, res, next) => { 
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const cleanedIp = ip.replace('::ffff:', ''); // IPv4 변환된 IP 제거

  if (cleanedIp.startsWith('192.168.0.' || cleanedIp === '127.0.0.1')) { // 
    next(); // 통과
  } else {
    res.status(403).json({ error: '접근이 제한된 IP입니다.' });
  }
});

// 라우터 등록 (중복 제거)
app.use('/join', joinRouter);
app.use('/check', checkRouter);
app.use('/login', loginRouter);
app.use('/find', findRouter);
app.use('/item', itemRouter);
app.use('/item',buyRouter);
app.use('/item/review', reviewRouter); 
app.use('/admin',adminRouter);
app.use('/admin', productRouter);
app.use('/admin', ordersRouter);
app.use('/admin', salesRouter);
app.use('/admin', salesproductRouter);
app.use('/admin',salestop5Router);
app.use('/admin',admin_discountRouter);
app.use('/mypage',mypageRouter);
app.use('/mypage',updateRouter);
app.use('/mypage', cartRouter);
app.use('/mypage', wishlistRouter);
app.use('/mypage', MyOrderRouter);
app.use('/img', express.static(path.join(__dirname, '../img')));

app.get('/', (req, res) => {
  res.json({ message: "서버 연결 성공" });
});

app.listen(8080,'0.0.0.0',()=>{ // 
    console.log("서버 실행중");
})

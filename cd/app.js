var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise'); // Dùng MySQL thay vì MongoDB

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

var app = express();

// 🔹 Kết nối MySQL với pool
var db = mysql.createPool({
  host: 'localhost', // Địa chỉ máy chủ MySQL (XAMPP mặc định là localhost)
  user: 'root', // Tài khoản MySQL mặc định là root
  password: '', // XAMPP mặc định không có mật khẩu
  database: 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  port: 3306,
  queueLimit: 0
});

// Kiểm tra kết nối MySQL
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Kết nối MySQL thành công!');
  } catch (err) {
    console.error('❌ Kết nối MySQL thất bại:', err);
  }
})();

// Middleware cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware truyền database vào routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Định tuyến API
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Xử lý lỗi 404
app.use((req, res, next) => {
  next(createError(404));
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  // Nếu có file error.pug, render view
  if (app.get('view engine') === 'pug') {
    return res.render('error');
  }

  // Nếu không, trả JSON lỗi
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err.stack : {},
  });
});

// Khởi động server
const port = 3333;
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});

module.exports = app;

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // Địa chỉ máy chủ MySQL (XAMPP mặc định là localhost)
    user: 'root', // Tài khoản MySQL mặc định là root
    password: '', // XAMPP mặc định không có mật khẩu
    database: 'product_db',
    waitForConnections: true,
    connectionLimit: 10,
    port: 3306,
    queueLimit: 0
});

module.exports = pool.promise();

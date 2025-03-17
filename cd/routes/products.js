const express = require('express');
const router = express.Router();
const db = require('./db'); // Kết nối MySQL

// 🟢 Lấy danh sách tất cả sản phẩm
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE isDeleted = 0');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🟢 Lấy thông tin sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ? AND isDeleted = 0', [req.params.id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "ID không tồn tại" });
    }
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🟢 Thêm sản phẩm mới
router.post('/', async (req, res) => {
  try {
    const { name, price = 0, quantity = 0, category } = req.body;
    const [result] = await db.query('INSERT INTO products (name, price, quantity, category) VALUES (?, ?, ?, ?)', [name, price, quantity, category]);

    res.status(201).json({ success: true, data: { id: result.insertId, name, price, quantity, category } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🟢 Cập nhật sản phẩm theo ID
router.put('/:id', async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    const [result] = await db.query(
      'UPDATE products SET name = ?, price = ?, quantity = ?, category = ? WHERE id = ? AND isDeleted = 0',
      [name, price, quantity, category, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "ID không tồn tại" });
    }

    res.status(200).json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🟢 Xóa sản phẩm theo ID (Cập nhật trạng thái isDeleted)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE products SET isDeleted = 1 WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "ID không tồn tại" });
    }

    res.status(200).json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

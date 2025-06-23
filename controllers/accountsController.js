const db = require('../../config/db');

// Lấy danh sách tất cả người dùng (admin only)
exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT user_id, full_name, role, email, gender, blood_group_id, health_status, created_at
    FROM accounts
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error while fetching users' });
    res.status(200).json(results);
  });
};

// Đổi quyền tài khoản (admin only)
exports.updateUserRole = (req, res) => {
  const { user_id } = req.params;
  const { newRole } = req.body;

  // Chỉ cho phép các role cụ thể
  const allowedRoles = ['member', 'staff', 'manager', 'admin'];
  if (!allowedRoles.includes(newRole)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  const sql = `UPDATE accounts SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`;

  db.query(sql, [newRole, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: `User ${user_id} role updated to ${newRole}` });
  });
};
// Tìm kiếm user theo user_id (CCCD) hoặc tên
exports.searchUsers = (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const sql = `
    SELECT user_id, full_name, role, email, gender, blood_group_id
    FROM accounts
    WHERE user_id LIKE ? OR full_name LIKE ?
    ORDER BY created_at DESC
  `;

  const likeQuery = `%${query}%`;
  db.query(sql, [likeQuery, likeQuery], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
// Xóa tài khoản (admin only)
exports.deleteUser = (req, res) => {
  const { user_id } = req.params;

  const sql = `DELETE FROM accounts WHERE user_id = ?`;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User ${user_id} has been deleted` });
  });
};
exports.updateComment = (req, res) => {
  const comment_id = req.params.commentId;
  const { content } = req.body;
  const user_id = req.user.id;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const checkSql = `SELECT * FROM comments WHERE comment_id = ? AND user_id = ?`;
  db.query(checkSql, [comment_id, user_id], (err, results) => {
    if (err) {
      console.error('Error checking comment:', err);
      return res.status(500).json({ error: 'Database error when checking comment' });
    }

    if (results.length === 0) {
      return res.status(403).json({ error: 'You can only update your own comment' });
    }

    const updateSql = `UPDATE comments SET content = ?, updated_at = NOW() WHERE comment_id = ?`;
    db.query(updateSql, [content, comment_id], (err, result) => {
      if (err) {
        console.error('Error updating comment:', err);
        return res.status(500).json({ error: 'Database error when updating comment' });
      }

      res.status(200).json({ message: 'Comment updated successfully' });
    });
  });
};
// Cập nhật trạng thái sức khỏe của thành viên (staff only)
exports.updateUserHealthStatus = (req, res) => {
  const { user_id } = req.params;
  const { health_status } = req.body;

  if (!health_status) {
    return res.status(400).json({ error: 'Health status is required' });
  }

  const sql = `
    UPDATE accounts 
    SET health_status = ?, updated_at = NOW()
    WHERE user_id = ?
  `;

  db.query(sql, [health_status, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ success: true, message: 'Health status updated' });
  });
};
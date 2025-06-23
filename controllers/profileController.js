const db = require('../config/db');

// Lấy thông tin cá nhân
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(results[0]);
  });
};

// Cập nhật thông tin cá nhân
exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const {
    weight, health_status, email, gender, ready_to_donate_date, last_donation_date, blood_group_id
  } = req.body;

  const sql = `
    UPDATE accounts SET
      weight = ?, health_status = ?, email = ?, gender = ?,
      ready_to_donate_date = ?, last_donation_date = ?, blood_group_id = ?, updated_at = NOW()
    WHERE user_id = ?
  `;

  db.query(sql, [weight, health_status, email, gender, ready_to_donate_date, last_donation_date, blood_group_id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ success: true, message: 'Profile updated' });
  });
};

// Xóa thông tin ngoài CCCD
exports.deleteProfileFields = (req, res) => {
  const userId = req.user.id;

  const sql = `
    UPDATE accounts SET
      weight = NULL, health_status = NULL, email = NULL, gender = NULL,
      ready_to_donate_date = NULL, last_donation_date = NULL, updated_at = NOW()
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Deletion failed' });
    res.json({ success: true, message: 'Sensitive info cleared' });
  });
};

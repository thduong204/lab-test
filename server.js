const express = require('express');
const app = express();

// Import routes
const labtestsRoutes = require('./routes/labtestsRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use(express.json());

// Use routes
app.use('/api/labtests', labtestsRoutes);
app.use('/api/profile', profileRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

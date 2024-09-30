const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/users.routes');
const postRoutes = require('./src/routes/post.routes');
const imageRoutes = require('./src/routes/upload.routes');
const otpRoutes = require('./src/routes/otp.routes');
const dotenv = require('dotenv').config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: ['http://15.207.26.134', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Define routes
app.use('/api', userRoutes, imageRoutes, postRoutes, otpRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

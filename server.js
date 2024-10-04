const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/users.routes');
const postRoutes = require('./src/routes/post.routes');
const imageRoutes = require('./src/routes/upload.routes');
const otpRoutes = require('./src/routes/otp.routes');
const app = express();
const dotenv = require('dotenv').config();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Add the new endpoint for testing
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Existing routes
app.use('/api', userRoutes, imageRoutes, postRoutes, otpRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: 'Internal Server Error' });
});

const server = app.listen(process.env.PORT || 5000, function (error) {
  if (error) return new Error(error);
  console.log('Server is running on http://localhost:' + (process.env.PORT || 5000));
});

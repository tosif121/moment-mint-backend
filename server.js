const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/users.routes');
const userPostRoutes = require('./src/routes/post.routes');
const userImageRoutes = require('./src/routes/upload.routes');
const app = express();
const dotenv = require('dotenv').config();

app.use(cors());

app.use(express.json());

app.use('/api', userRoutes, userImageRoutes, userPostRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: 'Internal Server Error' });
});

const server = app.listen(process.env.PORT || 5000, function (error) {
  if (error) return new Error(error);
  console.log('Server is running on http://localhost:' + (process.env.PORT || 5000));
});

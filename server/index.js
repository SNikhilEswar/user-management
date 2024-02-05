const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Allow only the specified frontend URL
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000'; // Replace with your frontend URL
const corsOptions = {
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())

// Connect to MongoDB
 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

 // Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

// Use user routes

app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
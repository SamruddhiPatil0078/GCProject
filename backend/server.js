require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

const app = express();

// 🔐 CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// 🔧 Middleware
app.use(express.json());

app.use(session({
  secret: 'your-secret-key', // ⚠️ change in production
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// 🔗 DB Connection
connectDB();

// 🚀 Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/gmail', require('./routes/gmailRoutes'));

// 🎯 Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
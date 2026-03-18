const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  callbackURL: process.env.GMAIL_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        accessToken,
        refreshToken,
        tokenExpiry: new Date(Date.now() + 3600000) // 1 hour
      });
      await user.save();
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.tokenExpiry = new Date(Date.now() + 3600000);
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const router = express.Router();

router.get('/google', passport.authenticate('google', { 
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/calendar.events' // 🔥 REQUIRED
  ],
  prompt: 'consent'
}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('http://localhost:5173/dashboard'); // Redirect to frontend
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('http://localhost:5173');
  });
});

router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

scope: [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.events' // 🔥 ADD THIS
]

module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google authentication
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(303, '/dashboard');
  });

// VK authentication
router.get('/vkontakte', passport.authenticate('vkontakte', { scope: ['status', 'email', 'friends', 'notify'] }));

router.get('/vkontakte/callback', 
  passport.authenticate('vkontakte', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(303, '/dashboard');
  });

router.get('/verify', (req, res) => {
  if(req.user) {
    console.log(req.user);
  } else {
    console.log('Вы не авторизованы');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
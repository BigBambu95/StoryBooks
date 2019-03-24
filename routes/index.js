const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log(res.locals);
  res.render('index/welcome');
});

router.get('/dashboard', (req, res) => {
  res.send('Dashboard');
});


module.exports = router;
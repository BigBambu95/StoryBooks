const app = require('express')();
const router = require('express').Router();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);

// server.listen(80);

// Chat Index
router.get('/', (req, res) => {
  res.render('chat/index');
});

  // Connection IO
  // io.on('connection', (socket) => {
  //   socket.broadcast.emit('hi');
  //   socket.on('chat message', (msg) => {
  //     io.emit('chat message', msg);
  //   });

  // });

  // io.emit('some event', {for: 'everyone'});

module.exports = router;
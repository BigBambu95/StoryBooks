document.addEventListener('DOMContentLoaded', () => {
  let sidenav = document.querySelector('.sidenav');
  let instance = M.Sidenav.init(sidenav);

  let btn = document.querySelector('.button-collapse');
  btn.addEventListener('click', () => {
    instance.open();
  });

  const socket = io.connect('http://localhost');
  $('#chat').submit(e => {
    e.preventDefault();
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  }); 
  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });
});
document.addEventListener('DOMContentLoaded', () => {
  let sidenav = document.querySelector('.sidenav');
  let instanceSidenav = M.Sidenav.init(sidenav);

  let select = document.querySelector('select');
  let instanceSelect = M.FormSelect.init(select);


  let btn = document.querySelector('.button-collapse');
  btn.addEventListener('click', () => {
    instanceSidenav.open();
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
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


const app = express();


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
// const chat = require('./routes/chat');

// Load Keys
const keys = require('./config/keys');

// Map Global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

  app.use(cookieParser());
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));
  
  // Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);
// app.use('/chat', chat);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Приложение запущено на порту ${port}`);
});
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Load Models
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passportGoogle')(passport);
require('./config/passportVK')(passport);

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

// Session Middleware
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

// 404 Page
app.use((req, res, next) => {
  res.status(404);
  res.render('404');
});

// 500 Page
app.use((req, res, next) => {
  res.status(500);
  res.render('500');
});

// Server Port
const port = process.env.PORT || 5000;

// Listen Port
app.listen(port, () => {
  console.log(`Приложение запущено на порту ${port}`);
});
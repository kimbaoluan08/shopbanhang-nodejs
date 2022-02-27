const path = require('path');
const express = require('express');
const handlebars  = require('express-handlebars');
const route = require('./routes');
const db = require('./config/db/database');
const hbs = require('handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const moment = require('moment');
const NumeralHelper = require("handlebars.numeral");

moment.locale('vi');
const app = express();
const port = 3000;
//----------------------------------------
//session
app.set('trust proxy', 1)
app.use(session({
  secret: 'shoppe',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore ({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
//sessiom
app.use(function(req, res, next){
  res.locals.session = req.session;
  res.locals.message = req.session.message;
  res.locals.order = req.session.order;
  res.locals.comment = req.session.comment;
  delete req.session.message;
  next();
})
//flash
app.use(flash());
//cookie
app.use(cookieParser());
//body parser
app.use(bodyParser.json());
//
app.use(express.static(path.join(__dirname, 'public')));
//use override
app.use(methodOverride('_method'));

//------------------------------------------
//hbs register
NumeralHelper.registerHelpers(hbs);

hbs.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

hbs.registerHelper('incremented', function (index) {
  index++;
  return index;
});

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

///-----------------------------------------------------
//connect db
db.connect();

//middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

//Template engine
app.engine('hbs', handlebars({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//routes init
route(app);

//port
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
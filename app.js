const express = require('express')
// const fs = require('fs')
// const https = require('https')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const passportSocketIo = require("passport.socketio");
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const appRoutes = require('./routes/app');
const ajaxRoutes = require('./routes/ajax');
const config = require('./config/secret');
const app = express();
require('dotenv').config()
const http = require('http').Server(app);  //Requiring socket.io
const io = require('socket.io')(http);

const sessionStore = new MongoStore({ url: config.database, autoReconnect: true });

const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  secret: 'process.env.SECRET',
  store: sessionStore,
  cookie: { maxAge: 720000 }, 
})

//Connection to the DB
mongoose.connect(config.database, { useFindAndModify: false }, function(err) {
  if (err) console.log(err);
  console.log("Connected to HMS database");
});
// mongoose.set('useFindAndModify', false)

// Various Library Use
app.set('view engine', 'ejs');
app.use(express.static('download'));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());


//saves the user session
app.use(sessionMiddleware);

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//local function
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Using the socket.io
//Teaching our io about passport
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       config.secret,    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         onAuthorizeFail    // *optional* callback on fail/error - read more below
}));


function onAuthorizeSuccess(data, accept) {
  console.log("Successful Connection");
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  if(error) accept(new Error(message));
}

require('./realtime/io')(io); //Requiring io

//Using the routes
app.use(userRoutes);
app.use(appRoutes);
app.use(authRoutes);
app.use(testRoutes);
app.use(ajaxRoutes);
app.use(function (req, res, next) {
  res.render('app/view/404')
})

// app.use(mainRoutes);


//Server listener
http.listen(config.port, (err) => {
  if (err) console.log(err);
  console.log(`Running on port ${config.port}`);
});

// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(config.port, (err) => {
//   if (err) console.log(err);
//   console.log(`Running on port ${config.port}`);
// });


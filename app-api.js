//taskkill /F /IM node.exe

const express = require('express');
const session = require('express-session')
const compression = require('compression');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
dotenv.config({ path: '.env' });
var config = require("./config");
const validator = require('express-joi-validation').createValidator({})
const expressStatusMonitor = require('express-status-monitor');
var errorHandler = require('errorhandler')
const https = require('https');
const http = require('http');



const passportInit = require('./config/passport');

const app = express();

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.LOCAL_MONGODB_URI);
var dbConnection = mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
mongoose.connection.once('open', () => {
console.log("connection to db established");

});
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: true 
}))

// Connecting sockets to the server and adding them to the request 
// so that we can access them later in the controller


app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || 3465);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passportInit()
app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:"+config.client);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// -- Controllers
const authController = require('./controllers/auth.controller')
const userController = require('./controllers/user.controller')



// Login And Signup
app.post('/v2/api/auth/login',  validator.body(userController.loginValidation), authController.login)
app.post('/v2/api/auth/register', validator.body(userController.registerValidation), authController.register)


// User
app.get('/v2/api/user/all', passport.authenticate('jwt-login'),userController.getAllUsers)
app.get('/v2/api/user/single/:_Id',  passport.authenticate('jwt-login'),validator.params(userController.userIdValidation), userController.getUserById)
app.get('/v2/api/user/search/firstname/:_Term', passport.authenticate('jwt-login'),validator.params(userController.searchByNameValidation), userController.searchUserByFirstName)
app.get('/v2/api/user/search/lastname/:_Term', passport.authenticate('jwt-login'),validator.params(userController.searchByNameValidation), userController.searchUserByLastName)
app.get('/v2/api/user/search/email/:_Term', passport.authenticate('jwt-login'),validator.params(userController.searchByEmailValidation), userController.searchUserByEmail)
app.get('/v2/api/user/search/phone/:_Phone', passport.authenticate('jwt-login'),validator.params(userController.searchPhoneValidation), userController.searchUserByPhone)
app.post('/v2/api/user/update/:_Id', passport.authenticate('jwt-login'),validator.params(userController.userIdValidation), validator.body(userController.userValidation),  userController.updateUserDetails)



/**
 * Error Handler.0-=
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}


/**
 * Start Express server.
 */

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
const passport = require('passport');
const jwt = require('jsonwebtoken')
const config = require("../config");
const UserModal = require('../controllers/shared_modals/user.modal').UserModal;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


module.exports = () => {
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))
  
  


  
  var jwt_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('JWT'),
    secretOrKey: process.env.JWT_SECRET
  }
  passport.use('jwt-login', new JwtStrategy(jwt_options, async (payload, done) => {
    try {
      
      user = await UserModal.findById(payload._id);
      if (!user) {
        return done(null, false, { message: 'Invalid User, Doesnot Exists!' });
      }
    } catch (err) {
      console.log('Passport JWT Strategy Error',err);
      return done(err);
    }
    return done(null, user);
  })
  )
  
}













//var FacebookStrategy = require('passport-facebook').Strategy;
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
//   // UserModal.findById(id, function(err, user) {
//   //     done(err, user);
//   // });
// });

// passport.use(new FacebookStrategy({

//     // pull in our app id and secret from our auth.js file
//     clientID        : config.sso.facebook.clientID,
//     clientSecret    : config.sso.facebook.clientSecret,
//     callbackURL     : config.sso.facebook.callbackURL

//   },

//   // facebook will send back the token and profile
//   function(token, refreshToken, profile, done) {

//     // asynchronous
//     process.nextTick(function() {

//         // find the user in the database based on their facebook id
//         UserModal.findOne({ 'facebook.id' : profile.id }, function(err, user) {

//             // if there is an error, stop everything and return that
//             // ie an error connecting to the database
//             if (err)
//                 return done(err);

//             // if the user is found, then log them in
//             if (user) {
//                 return done(null, user); // user found, return that user
//             } else {
//                 // if there is no user found with that facebook id, create them
//                 var newUser = new UserModal();

//                 // set all of the facebook information in our user model
//                 newUser.facebook.id    = profile.id; // set the users facebook id                   
//                 newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
//                 newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
//                 newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

//                 // save our user to the database
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;

//                     // if successful, return the new user
//                     return done(null, newUser);
//                 });
//             }

//         });
//     });

//   })
// );

// exports.generalCheck = (req, res, next) => {
//   //console.log(req);
//   next()
// }
// var jwt_options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('JWT'),
//   secretOrKey: process.env.JWT_SECRET
// }
// passport.use('jwt-login', new JwtStrategy(jwt_options, async (payload, done) => {
//   try {
    
//     user = await UserModal.findById(payload._id);
//     if (!user) {
//       return done(null, false, { message: 'Invalid User, Doesnot Exists!' });
//     }
//   } catch (err) {
//     console.log('Passport JWT Strategy Error',err);
//     return done(err);
//   }
//   return done(null, user);
// })
// )

// exports.isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.json({
//       status: false,
//       message: 'You are not logged in',
//       details: []
//     });
//   }
  
// };

// exports.isAdmin = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     if(req.user.role.some(role => {return role == 'super'})) {
//       return next();
//     } else {
//       res.json({
//         status: false,
//         message: 'You are not allowed to do this!',
//         details: []
//       });
//     }
//   } else {
//     res.json({
//       status: false,
//       message: 'You are not logged in',
//       details: []
//     });
//   }
// }

// exports.isStylistOrHeadStylist = (req, res, next) => {
//   var retObj = {
//     status: false,
//     message: 'You are not allowed to do this!',
//     details: []
//   }
//   var loggedInUser = req.user
//   console.log(typeof loggedInUser.role)
//   var b = false
//   if(typeof loggedInUser.role == 'object') {
//     loggedInUser.role.forEach(role => {
//       if(role == config.roles.STYLIST || role == config.roles.HEAD_STYLIST) {
//        b = true 
//       }
//     });
//     if(b) next()
//     else res.json (retObj)
//   } else if(typeof loggedInUser.role == 'string') {
//     if(loggedInUser.role == config.roles.STYLIST || loggedInUser.role == config.roles.HEAD_STYLIST) next()
//     else res.json(retObj)
//   }
// }
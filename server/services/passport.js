const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//create local Strategy
const localOptions = { userNameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  //verify this email and password
  User.findOne({ email: email }, function (err, user) {

    if (err) return done(err);
    if (!user) return done(null, false);

    //next we must compare the plain text password with the encrypted
    //password that is in our DB
    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false);

      return done(null, user);
    });

  });

});


//setup options for jwt Strategy
//option 1: this tells the jwt strat where to look for
//the jwt token.  in the jwtlogin constructor below
//we have a call back definition that assumes payload has
//an id property and that id property is the id of a particlar
//user.  the first option in jwtOptions gives access to the
//payload object
//the second option is our secret key which was encoded(created)
//in our authentication controller under the function def for tokenForUser()
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  //see if user id in the payload exists in our database.
  //if it does call done() with that user else call done without a
  //user object
  User.findById(payload.sub, function (err, user) {
    if (err) return done(err, false);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }

  });
});

//tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);

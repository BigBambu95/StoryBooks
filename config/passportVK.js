const VKStrategy = require('passport-vkontakte').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new VKStrategy({
      clientID: keys.VKClientID,
      clientSecret: keys.VKSecret,
      callbackURL: '/auth/vkontakte/callback'
    }, 
    (accessToken, refreshToken, params, profile, done) => {

      const image = profile.photos[0].value;

      const newUser = {
        authID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: image
      }
  
      // Check for existing user
      User.findOne({
        authID: profile.id
      })
        .then(user => {
          if(user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser)
              .save()
              .then(user => {
                done(null, user);
              });
          }
        }); 
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user));
  });
}
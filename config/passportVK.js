const VKStrategy = require('passport-instagram').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new VKStrategy({
      clientID: keys.instagramClientID,
      clientSecret: keys.instagramSecret,
      callbackURL: '/auth/instagram/callback'
    }, 
    (accessToken, refreshToken, params, profile, done) => {
      let image = profile._json.data.profile_picture;
      let firstName = profile.displayName.split(' ')[0];
      let lastName = profile.displayName.split(' ')[1];
    
      const newUser = {
        authID: profile.id,
        firstName: firstName,
        lastName: lastName,
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
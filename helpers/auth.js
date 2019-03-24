module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect(303, '/');
  },
  ensureGuest: function(req, res, next) {
    if(req.isAuthenticated()) {
      res.redirect(303, '/dashboard');
    } else {
      return next();
    }

  }
}
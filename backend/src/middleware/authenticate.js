const passport = require('passport');

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed. Token is invalid or expired.'
      });
    }
    
    // Attach user to request object
    req.user = user;
    return next();
  })(req, res, next);
};

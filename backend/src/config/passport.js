const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Local Strategy (email/password)
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      
      // Check if user exists
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          email,
          name: profile.displayName,
          authProvider: 'google',
          authProviderId: profile.id,
          freeEditsUsed: 0,
          creditBalance: 0
        });
      } else if (user.authProvider !== 'google') {
        // Update auth provider if user exists but used a different method before
        user.authProvider = 'google';
        user.authProviderId = profile.id;
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Apple OAuth Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY,
    callbackURL: process.env.APPLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.email;
      
      // Check if user exists
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          email,
          name: profile.name?.firstName ? `${profile.name.firstName} ${profile.name.lastName || ''}`.trim() : 'Apple User',
          authProvider: 'apple',
          authProviderId: profile.id,
          freeEditsUsed: 0,
          creditBalance: 0
        });
      } else if (user.authProvider !== 'apple') {
        // Update auth provider if user exists but used a different method before
        user.authProvider = 'apple';
        user.authProviderId = profile.id;
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

module.exports = passport;

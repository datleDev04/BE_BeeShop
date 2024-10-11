import User from '../models/User.js';
import PassportGoogleOAuth2 from 'passport-google-oauth2';
import { STATUS } from '../utils/constants.js';

const GoogleStrategy = PassportGoogleOAuth2.Strategy;

export default new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
  },
  async (request, accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ email: profile.email });
    if (!user) {
      const newUser = await User.create({
        full_name: profile.displayName,
        email: profile.email,
        avatar_url: profile.picture,
        status: STATUS.ACTIVE,
        is_verified: true,
        is_new_user: true,
      });
      return done(null, newUser);
    }
    return done(null, user);
  }
);

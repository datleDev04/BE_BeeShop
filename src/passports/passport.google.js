import User, { UserStatus } from '../models/User.js';
import PassportGoogleOAuth2 from 'passport-google-oauth2';

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
        user_name: profile.displayName,
        email: profile.email,
        avatar_url: profile.picture,
        status: UserStatus.ACTIVE,
      });
      return done(null, newUser);
    }
    return done(null, user);
  }
);

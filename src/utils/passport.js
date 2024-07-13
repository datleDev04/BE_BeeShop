import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({
            $or: [{ google_id: profile.id }, { email: profile.emails[0].value }],
          });
          if (user) {
            if (!user.google_id) {
              user = await User.findByIdAndUpdate(
                user.id,
                {
                  google_id: profile.id,
                  avatar_url: user?.avatar_url || profile.photos[0].value,
                },
                { new: true }
              );
            }
          } else {
            user = await User.create({
              google_id: profile.id,
              email: profile.emails[0].value,
              user_name: profile.displayName,
              avatar_url: profile.photos[0].value,
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default configurePassport;

import jwt from 'jsonwebtoken';

class jwtUtils {
  // create a new access token
  static createAccessToken = (user_id) => {
    const { ACCESS_SECRET } = process.env;

    return jwt.sign({ user_id }, ACCESS_SECRET, {
      expiresIn: 60 * 15,
    });
  };

  // create a new refresh token
  static createRefreshToken = () => {
    const { REFRESH_SECRET } = process.env;
    const data = Math.random() + new Date().getTime();

    return jwt.sign({ data }, REFRESH_SECRET, {
      expiresIn: '7d',
    });
  };

  static decodeAccessToken = (token) => {
    const { ACCESS_SECRET } = process.env;

    return jwt.verify(token, ACCESS_SECRET);
  };

  static decodeRefreshToken = (token) => {
    const { REFRESH_SECRET } = process.env;

    return jwt.verify(token, REFRESH_SECRET);
  };
}

export default jwtUtils;

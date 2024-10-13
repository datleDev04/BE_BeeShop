import User from '../models/User.js';

export const generateVerificationToken = async () => {
  let token;
  let tokenExists = true;

  while (tokenExists) {
    token = Math.floor(100000 + Math.random() * 900000).toString();
    tokenExists = await User.findOne({ verificationToken: token });
  }

  return token;
};

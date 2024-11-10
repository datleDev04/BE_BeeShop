import { transporter } from '../utils/mails.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  VERIFIED_EMAIL_TEMPLATE,
} from './emailTemplate.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    await transporter.sendMail({
      from: 'Beemely Store 👻',
      to: email,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendVerifiedEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: 'Beemely Store 👻',
      to: email,
      subject: 'Your email verified!',
      html: VERIFIED_EMAIL_TEMPLATE.replace('{name}', name),
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await transporter.sendMail({
      from: 'Beemely Store 👻',
      to: email,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: 'Beemely Store 👻',
      to: email,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

export const sendOrderSuccessEmail = async (email, template) => {
  try {
    await transporter.sendMail({
      from: 'Beemely Store 👻',
      to: email,
      subject: 'Đặt hàng thành công!',
      html: template,
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const mailForgotPassword = (resetPasswordUrl) => {
  return `
    <body style="background-color: #f0f0f5; font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://example.com/instagram-logo.png" alt="Instagram" style="width: 100px;">
            </div>
            <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #333; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Reset your password</h2>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p style="font-size: 16px; line-height: 1.6;">Please click on the link below to reset your password:</p>
            <a href="${resetPasswordUrl}" style="display: block; text-align: center; background-color: #3897f0; color: #fff; padding: 14px 0; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            <p style="font-size: 16px; line-height: 1.6;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
            <p>Thank you,</p>
            <p>Instagram Team</p>
            </div>
        </div>
        </body>

    `;
};

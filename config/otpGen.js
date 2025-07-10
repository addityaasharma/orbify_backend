import nodemailer from 'nodemailer';


export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export const sendOTP = async (toEmail, username = '') => {
    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"Orbify" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Verify Your Email - OTP Code',
        html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); background-color: #ffffff;">
      <div style="text-align: center;">
        <h2 style="color: #4A90E2;">🔐 Verify Your Email Address</h2>
      </div>

      <p style="font-size: 16px; color: #333;">Hi ${username || 'User'},</p>

      <p style="font-size: 15px; color: #555;">
        Thank you for signing up with <strong>Your App Name</strong>. To complete your registration, please use the following One-Time Password (OTP). This code is valid for <strong>2 minutes</strong>.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background-color: #f4f4f4; padding: 15px 30px; border-radius: 8px; font-size: 28px; letter-spacing: 5px; color: #2c3e50; font-weight: bold;">
          ${otp}
        </div>
      </div>

      <p style="font-size: 14px; color: #888;">
        Do not share this OTP with anyone. Our team will never ask for your password or OTP.
      </p>

      <p style="font-size: 14px; color: #888;">
        If you did not request this code, please ignore this email or contact support.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <div style="text-align: center; font-size: 12px; color: #aaa;">
        &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.<br />
        Need help? <a href="mailto:support@yourapp.com" style="color: #4A90E2;">Contact Support</a>
      </div>
    </div>
  `
    };


    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent to email:', toEmail);
        return { success: true, otp };
    } catch (error) {
        console.error('Failed to send OTP:', error);
        return { success: false, error: error.message };
    }
};
// src/utils/emailService.js
import nodemailer from "nodemailer";

// Reusable transporter using your working SMTP settings
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends onboarding credentials to the newly created user
 */
export const sendOnboardingEmail = async (email, name, password, branch) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const loginUrl = process.env.CLIENT_URL || 'http://localhost:3000/login';

  // Plain Text Fallback for strict spam filters
  const textContent = `
    Hello ${name},
    
    Welcome to the team! Your new account for the ${branch} branch has been created.
    
    Your Credentials:
    Email: ${email}
    Temporary Password: ${password}
    
    Please log in and update your password here: ${loginUrl}
    
    Best regards,
    Management Team
  `;

  // Clean, spam-safe HTML credential layout 
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #eaedf2; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #4f46e5; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">Welcome to the Team</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px;">Your onboarding profile is complete. An account has been set up for you under the <strong>${branch}</strong> location.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your Login Details:</h4>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> <span style="color: #4f46e5;">${email}</span></p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: monospace;">${password}</code></p>
        </div>

        <p style="font-size: 13px; color: #64748b;"><em>Note: For your account security, you will be prompted to change this temporary password during your first login.</em></p>
        
        <div style="text-align: center; margin-top: 28px;">
          <a href="${loginUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
            Sign In to Your Account
          </a>
        </div>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <div style="text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0;">This is an automated operational notification. Please do not reply directly to this email.</p>
      </div>
    </div>
  `;

  // Dispatches using your working global transport architecture
  await transporter.sendMail({
    from: `"Team Onboarding" <${from}>`,
    to: email,
    subject: `Your Account Credentials - ${branch}`, 
    text: textContent,
    html: htmlContent,
  });
};
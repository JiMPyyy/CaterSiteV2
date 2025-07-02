const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
  // Check if we have real email credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use Gmail with real credentials
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Fallback to Ethereal Email for testing (when no real credentials)
    console.log('⚠️  No email credentials found, using test email service');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Send email function
const sendEmail = async (to, subject, html, text = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CaterVegas <noreply@catervegas.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Using email service: ${process.env.EMAIL_USER ? 'Gmail' : 'Test Service'}`);

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);

    // For test emails, show preview URL
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Test email preview:', previewUrl);
      return {
        success: true,
        messageId: info.messageId,
        previewUrl
      };
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: null
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('Full error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Email templates
const emailTemplates = {
  orderStatusUpdate: (username, orderNumber, status, notes = '') => ({
    subject: `Order ${orderNumber} - Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Hello ${username},</p>
        <p>Your order <strong>#${orderNumber}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong></p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>Thank you for choosing CaterVegas!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  userBanned: (username, reason = '') => ({
    subject: 'Account Suspended',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Account Suspended</h2>
        <p>Hello ${username},</p>
        <p>Your CaterVegas account has been suspended.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you believe this is an error, please contact support.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  userUnbanned: (username) => ({
    subject: 'Account Reactivated',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2e7d32;">Account Reactivated</h2>
        <p>Hello ${username},</p>
        <p>Your CaterVegas account has been reactivated.</p>
        <p>You can now access your account normally.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  passwordReset: (username, newPassword) => ({
    subject: 'Password Reset - CaterVegas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>Hello ${username},</p>
        <p>Your password has been reset by an administrator.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>New Password:</strong> <code style="background: #fff; padding: 2px 5px; border-radius: 3px;">${newPassword}</code></p>
        </div>
        <p style="color: #d32f2f;"><strong>Important:</strong> Please log in and change your password immediately for security.</p>
        <p>If you did not request this reset, please contact support immediately.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  adminPromotion: (username) => ({
    subject: 'Admin Access Granted - CaterVegas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7b1fa2;">Admin Access Granted</h2>
        <p>Hello ${username},</p>
        <p>You have been granted administrator access to CaterVegas.</p>
        <p>You can now access the admin dashboard to manage orders and users.</p>
        <p><strong>Please use this access responsibly.</strong></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};

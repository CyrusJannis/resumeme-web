import sgMail from "@sendgrid/mail";

const sendgridApiKey = process.env.SENDGRID_API_KEY || "";
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@resumeme.app";
const SENDER_NAME = "ResumeME";

// Only initialize SendGrid if API key is valid
if (sendgridApiKey && sendgridApiKey.startsWith("SG.")) {
  sgMail.setApiKey(sendgridApiKey);
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationUrl: string
) {
  // Skip if SendGrid not configured
  if (!sendgridApiKey || !sendgridApiKey.startsWith("SG.")) {
    console.warn(
      "SendGrid not configured. Verification email not sent to:",
      email
    );
    return;
  }

  const message = {
    to: email,
    from: FROM_EMAIL,
    subject: "Verify your ResumeME Account",
    html: `
      <h2>Welcome to ResumeME, ${name}!</h2>
      <p>Please verify your email address to activate your account.</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
    `,
  };

  try {
    await sgMail.send(message);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("SendGrid error sending verification email:", error);
    // Don't re-throw - email failure shouldn't block signup
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
) {
  // Skip if SendGrid not configured
  if (!sendgridApiKey || !sendgridApiKey.startsWith("SG.")) {
    console.warn("SendGrid not configured. Password reset email not sent to:", email);
    return;
  }

  const message = {
    to: email,
    from: FROM_EMAIL,
    subject: "Reset your ResumeME Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  };

  try {
    await sgMail.send(message);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("SendGrid error sending password reset email:", error);
    // Don't re-throw - email failure shouldn't block password reset
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  // Skip if SendGrid not configured
  if (!sendgridApiKey || !sendgridApiKey.startsWith("SG.")) {
    console.warn("SendGrid not configured. Welcome email not sent to:", email);
    return;
  }

  const message = {
    to: email,
    from: FROM_EMAIL,
    subject: "Welcome to ResumeME!",
    html: `
      <h2>Welcome to ResumeME, ${name}!</h2>
      <p>Your account is now verified and ready to use.</p>
      <p>Start building your professional resume with our AI-powered editor:</p>
      <a href="${process.env.NEXTAUTH_URL}/editor/new" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Start Creating</a>
      <p>Need help? Check our <a href="${process.env.NEXTAUTH_URL}/help">Help Center</a>.</p>
    `,
  };

  try {
    await sgMail.send(message);
    console.log("Welcome email sent to:", email);
  } catch (error) {
    console.error("SendGrid error sending welcome email:", error);
    // Don't re-throw - email failure shouldn't block account creation
  }
}

export async function sendPaymentReceipt(
  email: string,
  name: string,
  amount: string,
  plan: string,
  invoiceId: string
) {
  // Skip if SendGrid not configured
  if (!sendgridApiKey || !sendgridApiKey.startsWith("SG.")) {
    console.warn("SendGrid not configured. Payment receipt not sent to:", email);
    return;
  }

  const message = {
    to: email,
    from: FROM_EMAIL,
    subject: `Payment Receipt - ResumeME ${plan} Plan`,
    html: `
      <h2>Payment Received</h2>
      <p>Hi ${name},</p>
      <p>Thank you for upgrading to the <strong>${plan}</strong> plan!</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Invoice ID:</strong> ${invoiceId}</p>
      <p>You now have access to premium features. Enjoy!</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/settings" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Subscription</a>
    `,
  };

  try {
    await sgMail.send(message);
    console.log("Payment receipt sent to:", email);
  } catch (error) {
    console.error("SendGrid error sending payment receipt:", error);
    // Don't re-throw - email failure shouldn't break payment flow
  }
}

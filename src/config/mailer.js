const nodemailer = require('nodemailer');
const env = require('./env');

const createTransporter = () => {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }
  return null;
};

const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Portfolio Contact Form" <${env.SMTP_USER || 'noreply@portfolio.com'}>`,
    to: env.CONTACT_RECEIVER_EMAIL,
    replyTo: email,
    subject: `[Portfolio Contact] ${subject || 'New message from ' + name}`,
    text: `You have received a new contact message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">New Portfolio Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `
  };

  if (!transporter) {
    console.log('✉️ [MOCK EMAIL LOG] SMTP not configured. Email notification simulation:');
    console.log(JSON.stringify(mailOptions, null, 2));
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending notification email:', error.message);
    // Don't fail the API request if email fails, message is still saved in DB
    return { success: false, error: error.message };
  }
};

module.exports = { sendContactEmail };

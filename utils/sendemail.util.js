const transporter = require("./email.util.js");

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
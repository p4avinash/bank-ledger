const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
})

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error)
  } else {
    console.log("Email server is ready to send messages")
  }
})

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking Ledger" <${process.env.GOOGLE_EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    })

    console.log("Message sent: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

async function sendRegistrationEmail(userEmail, name) {
  const subject = `Welcome to Banking Ledger`
  const text = `
  Hello ${name},
  Welcome to Banking Ledger!
  
  Thank you for joining our platform. We are excited to have you on board.

  You can now access your account and manage your transactions.
  `

  const html = `
    <div>
      <h2>${subject}</h2>
      <p>${text}</p>
      <p>Thank you,</p>
      <p>Banking Ledger Team</p>
    </div>
  `

  await sendEmail(userEmail, subject, text, html)
}

module.exports = { sendRegistrationEmail }

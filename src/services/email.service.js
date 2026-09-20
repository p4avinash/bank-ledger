const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking Ledger" <${process.env.GOOGLE_EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = `Welcome to Banking Ledger`;
  const text = `
  Hello ${name},
  Welcome to Banking Ledger!
  
  Thank you for joining our platform. We are excited to have you on board.

  You can now access your account and manage your transactions.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Welcome to Banking Ledger</h2>
      <p style="font-size: 15px; color: #334155;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Welcome to Banking Ledger! Thank you for joining our platform. We are excited to have you on board.
      </p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        You can now access your account, manage transactions, and track your ledger records in real time.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 13px; color: #64748b; margin: 0;">Thank you,</p>
      <p style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 2px 0 0 0;">Banking Ledger Team</p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(
  userEmailOrOptions,
  name,
  amount,
  toAccount,
  fromAccount,
  status = "COMPLETED",
  transactionId = ""
) {
  let userEmail, userName, txAmount, txToAccount, txFromAccount, txStatus, txId;

  if (typeof userEmailOrOptions === "object" && userEmailOrOptions !== null) {
    userEmail = userEmailOrOptions.userEmail;
    userName = userEmailOrOptions.name || "Customer";
    txAmount = userEmailOrOptions.amount;
    txToAccount = userEmailOrOptions.toAccount || "N/A";
    txFromAccount = userEmailOrOptions.fromAccount || "N/A";
    txStatus = userEmailOrOptions.status || "COMPLETED";
    txId = userEmailOrOptions.transactionId || "";
  } else {
    userEmail = userEmailOrOptions;
    userName = name || "Customer";
    txAmount = amount;
    txToAccount = toAccount || "N/A";
    txFromAccount = fromAccount || "N/A";
    txStatus = status || "COMPLETED";
    txId = transactionId || "";
  }

  const currentDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `Transaction Successful - ${txAmount} INR`;
  const text = `
Hello ${userName},

Transaction Successful!

Here are your transaction details:
- Status: ${txStatus}
- Amount: ₹${txAmount} (INR)
- From Account: ${txFromAccount}
- To Account: ${txToAccount}
${txId ? `- Transaction ID: ${txId}\n` : ""}- Date & Time: ${currentDate}

The amount of ₹${txAmount} has been debited from account (${txFromAccount}) and transferred to account (${txToAccount}).

Thank you for banking with us!

Banking Ledger Team
`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 6px 0;">Banking Ledger</h2>
        <span style="display: inline-block; background-color: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;">
          ✓ Transaction Successful (${txStatus})
        </span>
      </div>

      <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0;">Hello <strong>${userName}</strong>,</p>
      <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0; line-height: 1.5;">
        Your transaction of <strong>₹${txAmount}</strong> has been processed successfully.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold; width: 40%;">Status</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #15803d; font-weight: bold;">${txStatus}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Amount</td>
          <td style="padding: 10px 14px; font-size: 14px; color: #0f172a; font-weight: bold;">₹${txAmount} (INR)</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">From Account</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; font-family: monospace;">${txFromAccount}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">To Account</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; font-family: monospace;">${txToAccount}</td>
        </tr>
        ${
          txId
            ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Transaction ID</td>
                <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; font-family: monospace;">${txId}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Date & Time</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #334155;">${currentDate}</td>
        </tr>
      </table>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 20px 0;">
        The amount of <strong>₹${txAmount}</strong> has been debited from your account <strong>${txFromAccount}</strong> and credited to <strong>${txToAccount}</strong>.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 13px; color: #64748b; margin: 0;">Thank you for banking with us,</p>
      <p style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 2px 0 0 0;">Banking Ledger Team</p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(
  userEmailOrOptions,
  name,
  amount,
  toAccount,
  fromAccount,
  reason = "Transaction could not be processed",
  status = "FAILED",
  transactionId = ""
) {
  let userEmail, userName, txAmount, txToAccount, txFromAccount, txReason, txStatus, txId;

  if (typeof userEmailOrOptions === "object" && userEmailOrOptions !== null) {
    userEmail = userEmailOrOptions.userEmail;
    userName = userEmailOrOptions.name || "Customer";
    txAmount = userEmailOrOptions.amount;
    txToAccount = userEmailOrOptions.toAccount || "N/A";
    txFromAccount = userEmailOrOptions.fromAccount || "N/A";
    txReason = userEmailOrOptions.reason || "Transaction could not be processed";
    txStatus = userEmailOrOptions.status || "FAILED";
    txId = userEmailOrOptions.transactionId || "";
  } else {
    userEmail = userEmailOrOptions;
    userName = name || "Customer";
    txAmount = amount;
    txToAccount = toAccount || "N/A";
    txFromAccount = fromAccount || "N/A";
    txReason = reason || "Transaction could not be processed";
    txStatus = status || "FAILED";
    txId = transactionId || "";
  }

  const currentDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `Transaction Failed - ${txAmount} INR`;
  const text = `
Hello ${userName},

Transaction Failed!

Here are the details of the attempted transaction:
- Status: ${txStatus}
- Reason: ${txReason}
- Attempted Amount: ₹${txAmount} (INR)
- From Account: ${txFromAccount}
- To Account: ${txToAccount}
${txId ? `- Transaction ID: ${txId}\n` : ""}- Date & Time: ${currentDate}

Important: No money was deducted from your account (${txFromAccount}).

If you need any assistance, please feel free to reach out.

Banking Ledger Team
`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0 0 6px 0;">Banking Ledger</h2>
        <span style="display: inline-block; background-color: #fee2e2; color: #b91c1c; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;">
          ✕ Transaction Failed (${txStatus})
        </span>
      </div>

      <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0;">Hello <strong>${userName}</strong>,</p>
      <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0; line-height: 1.5;">
        Your attempted transfer of <strong>₹${txAmount}</strong> could not be completed.
      </p>

      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
        <p style="font-size: 13px; color: #991b1b; margin: 0; font-weight: bold;">Reason for failure:</p>
        <p style="font-size: 13px; color: #b91c1c; margin: 4px 0 0 0;">${txReason}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold; width: 40%;">Status</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #b91c1c; font-weight: bold;">${txStatus}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Attempted Amount</td>
          <td style="padding: 10px 14px; font-size: 14px; color: #0f172a; font-weight: bold;">₹${txAmount} (INR)</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">From Account</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; font-family: monospace;">${txFromAccount}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">To Account</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; font-family: monospace;">${txToAccount}</td>
        </tr>
        ${
          txId
            ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Transaction ID</td>
                <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; font-family: monospace;">${txId}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: bold;">Date & Time</td>
          <td style="padding: 10px 14px; font-size: 13px; color: #334155;">${currentDate}</td>
        </tr>
      </table>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 20px 0;">
        <strong>Note:</strong> No funds were deducted from your account. Please check your balance or account status and try again.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 13px; color: #64748b; margin: 0;">Thank you,</p>
      <p style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 2px 0 0 0;">Banking Ledger Team</p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};

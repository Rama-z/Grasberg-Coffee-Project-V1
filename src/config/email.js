require("dotenv").config();
const { MAIL_EMAIL, MAIL_PASSWORD } = process.env;

const MAIL_SETTINGS = {
  service: "gmail",
  auth: {
    user: MAIL_EMAIL,
    pass: MAIL_PASSWORD,
  },
};

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMails = async (params) => {
  try {
    console.log(process.env.LINK_DEPLOYMENT);
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: "Verify your email",
      html: `
      <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Hi.</h2>
          <h4>This Is Your Link Verification</h4>
          <p style="margin-bottom: 30px;">Please click <a href="${process.env.LINK_DEPLOYMENT}${params.OTP}" target="_blank">here</a> to verif your email</p>
      </div>
      `,
    });
    return;
  } catch (error) {
    console.log(error);
    return false;
  }
};

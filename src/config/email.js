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

module.exports = {
  sendMails: async (params) => {
    try {
      console.log(params);
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
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  sendForgot: async (params) => {
    try {
      let info = await transporter.sendMail({
        from: MAIL_SETTINGS.auth.user,
        to: params.to,
        subject: "Reset Password Verification",
        html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Hi.</h2>
            <h4>This Is Your Link For Change Your Password</h4>
            <p style="margin-bottom: 30px;">Need to reset your password? just click <a href="${params.link}" target="_blank">Here</a> to reset Password. your password</p>
        </div>
        `,
      });
      return;
    } catch (err) {
      console.log(err);
    }
  },
};

import nodemailer from "nodemailer";
/*
 * The code for the email implementation is based on the following resource:
 * https://dev.to/jahangeer/how-to-implement-password-reset-via-email-in-node-js-132m
 */

/**
 * Function to send an email, creates the transporter in nodemailer so mail can be sent
 *
 */
const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    //create transporter with the setup info
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: 587, // default mail submission port
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // send the email to the email address from the arguments
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
    });
    // console.log("Email sent.");
  } catch (err) {
    console.log(err);
    console.log("Email not sent.");
  }
};

export { sendEmail };

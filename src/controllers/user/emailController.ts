import { Request, Response } from "express";
import "dotenv/config";

import { User } from "../../models/user";
import { Customer } from "../../models/customer";
import { sendEmail } from "../../utils/sendEmail";
import { REDIRECT_TEXT, NEW_USER_SUBJECT, NEW_USER } from "../../constants";

/**
 * Takes in the destination customer, subject line, and body text, and sends an email with these details to
 * the destination customer.
 * @param req
 * @param res
 */
const emailCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const user = await User.findOne({ email: req.session.email });
    if (!user) {
      return res.send("User not found.");
    }
    const cust = await Customer.findOne({ _id: req.body.custId });
    if (!cust) {
      return res.send("Customer not found in database.");
    }
    await sendEmail(cust.email, req.body.subject, req.body.text + REDIRECT_TEXT.replace("<user>", user.email));
    return res.send("Email sent successfully!");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error: email could not be sent");
  }
};

/**
 * Emails the new user with instructions on how to log in
 * @param req
 * @param res
 */
const emailNewUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // Find the new user through the id
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("User not found.");
    }
    // Send email with pre-made subject and text
    await sendEmail(
      user.email,
      req.body.subject || NEW_USER_SUBJECT,
      NEW_USER.replace("<user>", user.name)
        .replace("<email>", user.email)
        .replace("<password>", req.body.password)
        .replace("<link>", process.env.ORIGIN_URL + "/login")
    );
    return res.send("Email sent successfully!");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error: email could not be sent");
  }
};

export { emailCustomer, emailNewUser };

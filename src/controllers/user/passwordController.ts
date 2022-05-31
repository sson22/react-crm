import { Request, Response } from "express";
import "dotenv/config";
import crypto from "crypto";

import { User } from "../../models/user";
import { Token } from "../../models/token";
import { sendEmail } from "../../utils/sendEmail";
import { EMAIL_TEXT } from "../../constants";

/**
 * This method implements the logic to update a user's passport
 * Update user takes a json object as the body with email, oldPassword and newPassword
 *
 * This function checks if the old password is correct, and if so then changes the
 * password. This is to be used in the user's account page if they remember their old
 * password and want to change it, is not used for remembering forgotten password
 *
 * @param {*} request
 * @param {*} response
 */
const updatePassword = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // check to see if any users with that id exist
    const usersWithEmail = await User.findOne({
      _id: req.body._id,
    });
    // If no users found, then user doesn't exist
    if (!usersWithEmail) {
      res.status(404);
      return res.send("User doesn't exist.\n");
    }

    // If oldPassword doesn't fit, send back error
    if (!usersWithEmail.validPassword(req.body.oldPassword)) {
      res.status(403);
      return res.send("Old password doesn't match.\n");
    }

    // Name and email don't change
    // Replace password with newPassword
    usersWithEmail.password = usersWithEmail.generateHash(req.body.newPassword);

    usersWithEmail.save();

    return res.send(usersWithEmail);
  } catch (err) {
    console.log("We have caught an error!\n");
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/** function to log out - session has passport (user id) and email, both have to be removed */
const logOut = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    req.logOut(); // remove passport from session
    req.session.email = ""; // remove email from session
    req.session.admin = null; // remove admin from session
    req.session.save();
    res.redirect("/users");
  } catch (err) {
    res.status(400);
    return res.send("Failed to log out.");
  }
};

/**
 * Function that checks if a page is logged in
 */
const isLoggedIn = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    if (req.isAuthenticated()) {
      return res.send(true);
    }
    return res.send(false);
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send(false);
  }
};

/*
 * A funciton to send the user a reset-password link. the user's email will be in the request body,
 * and this generates a token to be used to reset the user's password
 *
 */
const sendPasswordLink = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // find a user and their corresponding token to be used to reset their password
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Database query failed.");
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    // put together the email link and send the email
    const emailLink = `${process.env.ORIGIN_URL}/reset-password/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", EMAIL_TEXT.replace("<link>", emailLink).replace("<user>", user.name));

    return res.send("An email containing a link to reset the password was sent to the desired email account.");
  } catch (err) {
    console.log(err);
    return res.status(400).send("An error occurred. Please try again.");
  }
};

/*
 * A function to reset the user's password. The user has been sent a link
 * with the format {base_url}/reset-password/:userId/:token to their email,
 * and they input their password into the text box shown on the screen and click submit
 */
const resetPassword = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // find the user and their corresponding token for whose password is to be reset
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).send("Link is invalid or expired. Please contact your administrator");
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send("Link is invalid or expired. Please contact your administrator");
    }

    // store the new password in the user's information
    user.password = user.generateHash(req.body.password);
    await user.save();
    await token.delete();
    return res.send("Password has been reset.");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Password could not be reset. An error occurred.");
  }
};

// remember to export the functions
export { updatePassword, logOut, isLoggedIn, sendPasswordLink, resetPassword };

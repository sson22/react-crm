// Passport middleware used for login and logout

// used to create our local strategy for authenticating
// using username and password
import { Request } from "express";
import passportLocal from "passport-local";
import passport from "passport";

import { User, UserInterface } from "../models/user";
const LocalStrategy = passportLocal.Strategy;

/* These are the functions used to serialise and deserialise a user from the session
 * This allows a session to be established and maintained in the browser
 */
passport.serializeUser(function (user: UserInterface, done) {
  done(null, user._id);
});
passport.deserializeUser(function (_id: string, done) {
  User.findById(_id, function (err: Error | null, user: UserInterface) {
    done(err, user);
  });
});

/* This is the strategy used by passport to authenticate and login a user
 * The database is searched for a user matching the email and password provided,
 * and will fail if either of these are incorrect, or succeed and add the user
 * to the session.
 *
 * Email and admin status saved to the session storage
 *
 * Note: add check for multiple users later
 */
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req: Request, email: string, password: string, done) {
      process.nextTick(function () {
        User.findOne({ email: email.toLowerCase() }, async function (err: Error | null, user: UserInterface) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: "Incorrect email. Please try again.",
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: "Incorrect password. Please try again.",
            });
          }
          req.session.email = email;
          req.session.admin = user.admin;
          await req.session.save();
          return done(null, user);
        });
      });
    }
  )
);

/*
 * This is the strategy used to sign up  a new user - may need to change
 * depending on how we implement sign-up. If done by admin will change it
 * to a function in userController
 */
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req: Request, email: string, password: string, done) {
      process.nextTick(function () {
        // look for a user in the database to see if one with this email address already exists.
        // if so, stop account creation and ask for another email address. Otherwise, create the account
        User.findOne({ email: email.toLowerCase() }, function (err: Error | null, existingUser: UserInterface) {
          if (err) {
            return done(err);
          }
          // check if user already exists
          if (existingUser) {
            return done(null, false, {
              message: "Email already in use. Please use another email address.",
            });
          } else {
            // if the user doesn't already exist, create a new User document,
            // and add this information
            const newUser: UserInterface = new User();
            newUser.name = req.body.name;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.admin = req.body.admin;
            // console.log(newUser);
            // save the new user to the database
            newUser.save(function (err: Error | null) {
              if (err) {
                throw err;
              }
              req.session.email = email;
              req.session.admin = req.body.admin;
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

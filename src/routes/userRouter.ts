import express from "express";
import passport from "passport";
import { upload } from "../config/multerConfig";

// require the User Controller
// TODO: default export should be specified.
import * as userController from "../controllers/user/userController";
import * as passwordController from "../controllers/user/passwordController";
import * as adminController from "../controllers/user/adminController";
import * as emailController from "../controllers/user/emailController";
import * as userPhotoController from "../controllers/user/userPhotoController";

// define the router
const userRouter = express.Router();

/* Https requests CRUD demo resources */
userRouter.get("/", userController.getAllUsers);
userRouter.get("/user-info", userController.getLoggedUser);
userRouter.get("/userById/:id", userController.getUserById);
userRouter.post("/usersByIds/", userController.getUsersByIds);
userRouter.post("/createUser", userController.createUser);
userRouter.post("/updateUser", userController.updateUser);
userRouter.post("/updateAdmin/:id", adminController.updateAdmin); // Flips the admin status of the admin with :id
userRouter.post("/updatePassword", passwordController.updatePassword);
userRouter.delete("/removeUser/:id", userController.removeUser);

/* Login and password related routes */
userRouter.post("/login", passport.authenticate("local-login", { successRedirect: "/users/user-info" }));
userRouter.get("/logout", passwordController.logOut);
userRouter.get("/checkLogin", passwordController.isLoggedIn);
userRouter.get("/checkAdmin", adminController.isAdmin);
userRouter.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/users/",
    failureRedirect: "/users/",
  })
);
userRouter.post("/reset-password", passwordController.sendPasswordLink);
userRouter.post("/reset-password/:userId/:token", passwordController.resetPassword);

/* Profile picture related routes */
userRouter.get("/get-photo/:id", userPhotoController.retrieveProfilePicture);
userRouter.post("/upload-photo", upload.single("image"), userPhotoController.uploadProfilePicture);
userRouter.post("/upload-stock-photo", upload.single("image"), userPhotoController.newStockPhoto);
userRouter.post("/remove-profile-photo", userPhotoController.removeUserPhoto);

/* User search related routes */
userRouter.get("/search/:text", userController.searchUser);
userRouter.get("/admins", adminController.searchAdmins);
userRouter.get("/employees", adminController.searchEmployees);
userRouter.post("/convert-user-id", userController.convertUserIds);

/* Sending email related routes */
userRouter.post("/email-customer", emailController.emailCustomer);
userRouter.post("/email-new-user", emailController.emailNewUser);

export { userRouter };

import { Request, Response } from "express";
import "dotenv/config";

import { User, UserInterface } from "../../models/user";
import { Image } from "../../models/image";
import { StockImage } from "../../models/stockImage";

/* Get all users */
const getAllUsers = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // used unknown instead of any
  try {
    const user = await User.find({});
    return res.send(user);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

/* Find a user by id */
const getUserById = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const user = await User.findById(req.params.id);
    return res.send(user);
  } catch (err) {
    res.status(400);
    return res.send("getUserById query failed");
  }
};

/* find user who is logged in */
const getLoggedUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    if (await req.isAuthenticated()) {
      const oneUser = await User.findOne({ email: req.session.email });
      if (oneUser === null) {
        // no user found in database
        res.status(404);
        return res.send("User not found");
      }
      return res.send(oneUser);
    }
    return res.send("Not logged in.");

    // user was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * This method implements the logic to create a user, but does not log in the user

 *
 * @param {*} request
 * @param {*} response
 */
const createUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // Store in the database
  try {
    // check to see if any users with that email already exist
    const usersWithEmail = await User.findOne({
      email: req.body.email,
    });
    // if user with email already exists, don't allow a new user to be made
    if (usersWithEmail) {
      res.status(404);
      return res.send("Email already exists.");
    }

    // create a random string as a password
    //const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    // allocate random profile picture for user - pick one out of all stock images
    // const rand = Math.floor(Math.random()*(await StockImage.countDocuments()));
    const stockImages = await StockImage.aggregate([{ $sample: { size: 1 } }]);
    const chosenImage = stockImages[0];

    // create image with the stock photo to assign to user
    const userImage = new Image({
      name: req.body.name,
      img: {
        data: chosenImage.img.data,
      },
    });
    await Image.create(userImage);

    // create a new user and save it to the database
    const newUser: UserInterface = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = newUser.generateHash(req.body.password);
    newUser.admin = req.body.admin;
    newUser.image = userImage._id;
    newUser.save();

    return res.send(newUser);
  } catch (err) {
    console.log("We have caught an error!\n");
    console.log(err);
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * This method implements the logic to update a user (either by user or admin)
 * Update user takes a json object as the body with name, email and other info
 *
 * MUST MAKE SURE THAT JSON OBJECT IS WHAT WE WANT TO BE, THIS CHANGE IS PERMANENT
 * DO NOT ALLOW THE USER TO CHANGE THEIR OWN EMAIL, THE OLD EMAIL WILL BE SAVED ON SESSION
 * IF USER CHANGES EMAIL, THEY MUST BE LOGGED OUT
 *
 * @param {*} request
 * @param {*} response
 */
const updateUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // check to see if any users with that id exist
    const usersWithId = await User.findOne({
      _id: req.body._id,
    });
    // If no users found, then user doesn't exist
    if (!usersWithId) {
      res.status(404);
      return res.send("User doesn't exist.");
    }
    // If any of the fields in the form have been filled in, update the
    // corresponding field in the customer object
    if (req.body.name) {
      usersWithId.name = req.body.name;
    }
    if (req.body.email) {
      usersWithId.email = req.body.email;
    }

    // Should we ever update admin status?
    if (req.body.admin) {
      usersWithId.admin = req.body.admin;
    }
    usersWithId.save();

    return res.send(usersWithId);
  } catch (err) {
    console.log("We have caught an error!\n");
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * This method implements the logic to removeUser
 *
 * @param {*} request
 * @param {*} response
 */
const removeUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  /* Check to see if the user is in database, if so delete */
  try {
    /* Look for all the users with these details */
    await User.deleteOne({ _id: req.params.id });
    return res.send("User " + req.params.id + " has been removed"); // user was removed
  } catch (err) {
    // General error
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * Function that searches a user through name (using regex)
 *
 * @param {*} request
 * @param {*} response
 */
const searchUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // Check to see if the input is present in the user's name
  try {
    const searchedUsers = await User.find({ name: { $regex: req.params.text, $options: "i" } });

    return res.send(searchedUsers);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: user search search query failed!");
  }
};

/* Takes an array of user Ids and returns an array of user's names */
const convertUserIds = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const nameArray: string[] = [];

    // check to see if any users with that id exist, if so push their names to the array
    if (req.body.userIds.length > 0) {
      for (const id of req.body.userIds) {
        const userWithId = await User.findOne({
          _id: id,
        });
        nameArray.push(userWithId.name);
      }
    }
    return res.send(nameArray);
  } catch (err) {
    console.log("We have caught an error!\n");
    console.log(err);
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/* Takes an array of user Ids and returns an array of users */
const getUsersByIds = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const userArray: UserInterface[] = [];

    // check to see if any users with that id exist, and if so push user to array
    if (req.body.userIds.length > 0) {
      for (const id of req.body.userIds) {
        const userWithId = await User.findOne({
          _id: id,
        });
        userArray.push(userWithId);
      }
    }
    return res.send(userArray);
  } catch (err) {
    console.log("We have caught an error!\n");
    console.log(err);
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// remember to export the functions
export {
  getAllUsers,
  getUserById,
  getLoggedUser,
  createUser,
  updateUser,
  removeUser,
  searchUser,
  convertUserIds,
  getUsersByIds,
};

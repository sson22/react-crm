import { Request, Response } from "express";
import "dotenv/config";

import { User } from "../../models/user";

/**
 * This method implements the logic to update a customer's details favourite status
 *
 * @param {*} request
 * @param {*} response
 */
const updateAdmin = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // check to see if any customers with that id exist
    const userWithEmail = await User.findOne({ _id: req.params.id });

    // If no customer found, then user doesn't exist
    if (!userWithEmail) {
      res.status(404);
      return res.send("User doesn't exist.");
    }

    userWithEmail.admin = !userWithEmail.admin;
    userWithEmail.save();

    return res.send(userWithEmail);
  } catch (err) {
    console.log("We have caught an error!\n");
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * This method implements the logic to search for admins
 *
 * @param {*} request
 * @param {*} response
 */
const searchAdmins = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // If you ever want to get all the users that aren't admins, create an identical
    // function, but replace { admin: true } with { admin: { $ne: true } }
    const admins = await User.find({ admin: true });

    // If there are no admins found
    if (admins === null || admins.length === 0) {
      res.status(404); // Should we return an error if there are no admins?
      return res.send("No admins found");
    }

    return res.send(admins);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: admin search query failed!");
  }
};

/**
 * This method implements the logic to search for employees
 *
 * @param {*} request
 * @param {*} response
 */
const searchEmployees = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const employees = await User.find({ admin: { $ne: true } });

    // If there are no employees found
    if (employees === null || employees.length === 0) {
      res.status(404); // Should we return an error if there are no employees?
      return res.send("No employees found");
    }

    return res.send(employees);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: employee search query failed!");
  }
};

/**
 * Function that checks if a page is in admin mode
 */
const isAdmin = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // Check if logged in, else automatically false
    if (req.isAuthenticated()) {
      // Check what admin flag in session is
      if (req.session.admin) {
        return res.send(true);
      }
    }
    return res.send(false);
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send(false);
  }
};

// remember to export the functions
export { updateAdmin, searchAdmins, searchEmployees, isAdmin };

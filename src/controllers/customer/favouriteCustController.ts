// import the request and response interfaces from express
import { Request, Response } from "express";

// import demo schema model
import { Customer } from "../../models/customer";

/**
 * This method implements the logic to update a customer's details favourite status
 *
 * @param {*} request
 * @param {*} response
 */
const updateFavourite = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // check to see if any customers with that id exist
    const customersWithId = await Customer.findOne({ _id: req.params.id });

    // If no customer found, then user doesn't exist
    if (!customersWithId) {
      res.status(404);
      return res.send("Customer doesn't exist.");
    }

    // If the favourite status is true, change to false, and vice versa
    // This is currently done using strings as false doesn't save on mongoDB
    // Best to try and rewrite this with booleans later for neater code
    if (customersWithId.favourite.toString() == "true") {
      customersWithId.favourite = false;
    } else if (customersWithId.favourite.toString() == "false") {
      customersWithId.favourite = true;
    }
    // If favourite status is neither true nor false, something went wrong
    else {
      res.status(404);
      return res.send("Favourite status is neither true nor false");
    }
    customersWithId.save();

    return res.send(customersWithId);
  } catch (err) {
    console.log("We have caught an error!\n");
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * This method implements the logic to search for favourited customers
 *
 * @param {*} request
 * @param {*} response
 */
const searchFavourites = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // If you ever want to get all the customers that aren't favourites, create an identical
    // function, but replace { favourite: true } with { favourite: { $ne: true } }
    const favouriteCustomers = await Customer.find({ favourite: true });

    // If there are no favourite customers found
    if (favouriteCustomers === null || favouriteCustomers.length === 0) {
      res.status(404); // Should we return an error if there are no favourites?
      return res.send("Favourite customers not found");
    }

    return res.send(favouriteCustomers);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: favourite customers search query failed!");
  }
};

// Export the functions to be used
export { updateFavourite, searchFavourites };

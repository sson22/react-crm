// import the request and response interfaces from express
import { Request, Response } from "express";

// import demo schema model
import { Customer } from "../../models/customer";

/**
 * This method implements the logic to update a customer's details
 * updateCustomer takes a JSON document with new information
 * The user can change a customer's name, company name, phone number,
 * favourite status or email
 *
 * @param {*} request
 * @param {*} response
 */
const updateCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // check to see if any customers with that id exist
    const customersWithId = await Customer.findOne({
      _id: req.body._id,
    });
    // If no customer found, then user doesn't exist
    if (!customersWithId) {
      res.status(404);
      return res.send("Customer doesn't exist.");
    }

    // If any of the fields in the form have been filled in, update the
    // corresponding field in the customer object
    if (req.body.name) {
      customersWithId.name = req.body.name;
    }
    if (req.body.company) {
      customersWithId.company = req.body.company;
    }
    if (req.body.phone) {
      customersWithId.phone = req.body.phone;
    }
    if (req.body.email) {
      customersWithId.email = req.body.email;
    }
    if (req.body.favourite != null) {
      customersWithId.favourite = req.body.favourite;
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

/* Handle request to create a new customer */
const createCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const newCust = new Customer({
      name: req.body.name,
      company: req.body.company,
      phone: req.body.phone,
      email: req.body.email,
      favourite: req.body.favourite,
    });

    await Customer.create(newCust);
    return res.send(newCust);
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("Customer could not be created.");
  }
};

/* Handle request to delete a customer */
const deleteCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    return res.send("Customer " + req.params.id + " has been removed");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("Customer could not be deleted.");
  }
};

/**
 * This method implements the logic to search for customers by name
 * @param {*} request
 * @param {*} response
 */
const searchCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // Check to see if the input is present in the client name
  try {
    const searchedCustomers = await Customer.find({
      $or: [
        { name: { $regex: req.params.text, $options: "i" } },
        // If you want to search for customers by name and company, uncomment next line
        // { company: { $regex: req.params.text, $options: "i" } },
      ],
    });

    return res.send(searchedCustomers);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: customer search search query failed!");
  }
};

// Export the functions to be used
export { createCustomer, updateCustomer, deleteCustomer, searchCustomer };

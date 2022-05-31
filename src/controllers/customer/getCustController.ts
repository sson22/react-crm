// import the request and response interfaces from express
import { Request, Response } from "express";

// import demo schema model
import { Customer, CustomerInterface } from "../../models/customer";

/* Handle request to get a list of all customers */
const getAllCustomers = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // used unknown instead of any
  try {
    const customer = await Customer.find({});
    return res.send(customer);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

/* Handle request to get a single customer by id */
const getCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // search for a specific customer by their name or company name
  try {
    const oneCust = await Customer.findOne({ _id: req.params.id });
    if (oneCust === null) {
      // no customer found in database
      res.status(404);
      return res.send("Customer not found");
    }
    return res.send(oneCust); // customer was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/* Takes an array of customer Ids, and returns an array of the names of those customers */
const convertCustIdsToNames = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // Array of customer names to be filled out
    const nameArray: string[] = [];

    // Loop through the custIds list, find customer, and insert name in array
    if (req.body.custIds.length > 0) {
      for (const id of req.body.custIds) {
        const custWithId = await Customer.findOne({
          _id: id,
        });
        nameArray.push(custWithId.name);
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

/* Gets list of customer ids and returns a list of those customer's emails */
const convertCustIdsToEmails = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // The array with emails from the id array
    const emailArray: string[] = [];

    // Loop through the custIds list, find customer, and insert email in array
    if (req.body.custIds.length > 0) {
      for (const id of req.body.custIds) {
        const custWithId = await Customer.findOne({
          _id: id,
        });
        emailArray.push(custWithId.email);
      }
    }
    return res.send(emailArray);
  } catch (err) {
    console.log("We have caught an error!\n");
    console.log(err);
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/* Takes an array of cust ids and returns array of customers */
const getCustsByIds = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // The array with customers from the id array
    const custArray: CustomerInterface[] = [];

    // Loop through the custIds list, find customer, and insert customer in array
    if (req.body.custIds.length > 0) {
      for (const id of req.body.custIds) {
        const custWithId = await Customer.findOne({
          _id: id,
        });
        custArray.push(custWithId);
      }
    }

    return res.send(custArray);
  } catch (err) {
    console.log("We have caught an error!\n");
    console.log(err);
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// Export the functions to be used
export { getAllCustomers, getCustomer, convertCustIdsToNames, getCustsByIds, convertCustIdsToEmails };

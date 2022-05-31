import express = require("express");
import { upload } from "../config/multerConfig";

// require the Customer Controller
import custController = require("../controllers/customer/custController");
import getCustController = require("../controllers/customer/getCustController");
import favouriteCustController = require("../controllers/customer/favouriteCustController");
import custPhotoController = require("../controllers/customer/custPhotoController");

// define the router
const custRouter = express.Router();

// handle requests to get all of the customers
custRouter.get("/", getCustController.getAllCustomers);

// takes array of custIds and returns information about customers
custRouter.post("/convert-cust-id", getCustController.convertCustIdsToNames);
custRouter.post("/get-cust-email", getCustController.convertCustIdsToEmails);
custRouter.post("/custs-by-ids", getCustController.getCustsByIds);

// handle requests to get a single customer by customer id
custRouter.get("/find-one/:id", getCustController.getCustomer);

//handle requests to add a new customer
custRouter.post("/createCustomer", custController.createCustomer);

//handle requests to edit an existing customer
custRouter.post("/edit", custController.updateCustomer);

// flip the favourite status
custRouter.post("/favourite/:id", favouriteCustController.updateFavourite);

//handle requests to delete a customer
custRouter.delete("/removeCustomer/:id", custController.deleteCustomer);

// searching
custRouter.get("/search/:text", custController.searchCustomer);

// search for favourite customers
custRouter.get("/favourite", favouriteCustController.searchFavourites);

// handle request to get the company photo
custRouter.get("/get-photo", custPhotoController.retrieveCompanyPhoto);

// handle request to upload the company photo for a customer
custRouter.post("/upload-photo", upload.single("image"), custPhotoController.uploadCompanyPhoto);

export { custRouter };

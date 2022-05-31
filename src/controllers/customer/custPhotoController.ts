// import the request and response interfaces from express
import { Request, Response } from "express";

// import demo schema model
import { Customer } from "../../models/customer";
import { Image } from "../../models/image";

// import file system access
import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * This method implements the logic to add a profile picture to the customer
 * whose custId is in the request body, by adding the image added as a file
 * in the request form
 */
const uploadCompanyPhoto = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // find the customer whose profile picture this will be
    const custProfile = await Customer.findOne({ _id: req.body.custId });
    if (!custProfile) {
      return res.send("ERROR NO CUSTOMER");
    }
    //if they have a profile picture already stored, delete it from the database
    if (custProfile.image) {
      await Image.deleteOne({ _id: custProfile.image });
    }
    // create a new image object taking the image
    await sharp("src/uploads/" + req.file.filename)
      .resize({ width: 500 })
      .toFile(path.resolve(req.file.destination, req.file.filename + "resized"));
    const obj = new Image({
      name: custProfile.name,
      img: {
        data: fs.readFileSync(path.resolve("src/uploads/" + req.file.filename + "resized")),
      },
    });

    // delete the image file from the server
    fs.unlinkSync(path.resolve("src/uploads/" + req.file.filename));
    fs.unlinkSync(path.resolve("src/uploads/" + req.file.filename + "resized"));

    // store the image object in the database, and under the customer schema
    await Image.create(obj);
    custProfile.image = obj._id;
    custProfile.save();
    return res.send("Success! Saved profile picture");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("ERROR: unable to upload photo!");
  }
};

/**
 * This method implements the logic to return the profile picture
 * of the customer whose custId is in the request body
 */
const retrieveCompanyPhoto = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // find the customer in the database whose profile picture you want to display
    const cust = await Customer.findOne({ _id: req.body.custId });
    if (!cust) {
      return res.send("No customer");
    }
    // find the customer's profile picture, and return it
    const img = await Image.findOne({ _id: cust.image });
    if (!img) {
      return res.send("No image found");
    }
    return res.send(img);
  } catch (err) {
    res.status(400);
    return res.send("ERROR: unable to view photo!");
  }
};

// Export the functions to be used
export { uploadCompanyPhoto, retrieveCompanyPhoto };

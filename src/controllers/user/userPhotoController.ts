import { Request, Response } from "express";
import "dotenv/config";
import path from "path";
import fs from "fs";
import sharp from "sharp";

import { User } from "../../models/user";
import { Image } from "../../models/image";
import { StockImage } from "../../models/stockImage";

/**
 * This method implements the logic to add a profile picture to the user
 * who is logged in, by adding the image added as a file in the request form
 *
 * @param {*} request
 * @param {*} response
 */
const uploadProfilePicture = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    if (await req.isAuthenticated()) {
      // find the user whose profile picture is being stored
      const oneUser = await User.findOne({ email: req.session.email });
      if (oneUser === null) {
        // no user found in database
        res.status(404);
        return res.send("User not found.");
      }
      //if they have a profile picture already stored, delete it from the database
      if (oneUser.image) {
        await Image.deleteOne({ _id: oneUser.image });
      }
      // create a new image object with the image resized to have a width of 500px
      await sharp("src/uploads/" + req.file.filename)
        .resize({ width: 500 })
        .toFile(path.resolve(req.file.destination, req.file.filename + "resized"));
      const obj = new Image({
        name: oneUser.name,
        img: {
          data: fs.readFileSync(path.resolve("src/uploads/" + req.file.filename + "resized")),
        },
      });

      // delete the image file from the server
      fs.unlinkSync(path.resolve("src/uploads/" + req.file.filename));
      fs.unlinkSync(path.resolve("src/uploads/" + req.file.filename + "resized"));

      // store the image object in the database, and under the customer schema
      await Image.create(obj);
      oneUser.image = obj._id;
      oneUser.save();
      return res.send("Success! Saved profile picture");
    }
    return res.send("Not logged in.");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("ERROR: unable to upload photo!");
  }
};

/**
 * This method implements the logic to retrieve a user's profile picture
 *
 * @param {*} request
 * @param {*} response
 */
const retrieveProfilePicture = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // find the user in the database whose profile picture you want to display
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.send("No user found.");
    }
    // find the user's profile picture, and return it
    const img = await Image.findOne({ _id: user.image });
    if (!img) {
      return res.send("No image found.");
    }
    return res.send(img);
  } catch (err) {
    res.status(400);
    return res.send("ERROR: unable to view photo!");
  }
};

/**
 * Function to upload new stock photos. Should not be linked to in the website
 * - backend function for if we want to add more stock photos to be used as profile pictures
 * Resource to figure out how to use sharp to compress images:
 * https://dev.to/mkilmer/how-to-upload-image-using-multer-and-sharp-45lm
 */
const newStockPhoto = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    await sharp("src/uploads/" + req.file.filename)
      .resize({ width: 500 })
      .toFile(path.resolve(req.file.destination, req.file.filename + "resized"));
    const obj = new StockImage({
      name: "",
      img: {
        data: fs.readFileSync(path.resolve("src/uploads/" + req.file.filename + "resized")),
      },
    });

    // delete the image file from the server
    fs.unlinkSync(path.resolve("src/uploads/" + req.file.filename));
    fs.unlinkSync(path.resolve("src/uploads/" + req.file.filename + "resized"));
    await StockImage.create(obj);
    return res.send("Added new stock image!");
  } catch (err) {
    res.status(400);
    return res.send("ERROR: unable to upload photo!");
  }
};

/* Function to remove the profile photo associated with the logged in user - leaves image null.
May need to later be changed to assign a random profile picture to the user. */
const removeUserPhoto = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const user = await User.findOne({ email: req.session.email });
    if (!user) {
      return res.send("ERROR: No user found.");
    }
    const imageToDelete = user.image;
    if (!user.image) {
      return res.send("ERROR: No user image found.");
    }
    await Image.deleteOne({ _id: imageToDelete });
    user.image = null;
    user.save();
    return res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to delete user photo");
  }
};

// remember to export the functions
export { uploadProfilePicture, retrieveProfilePicture, newStockPhoto, removeUserPhoto };

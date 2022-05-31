import { Request, Response } from "express";

// import meeting schema model
import { Meeting } from "../../models/meeting";

/**
 * This method implements the logic to search for one meeting by id
 *
 * @param {*} request
 * @param {*} response
 */
const getOneMeeting = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const oneMeeting = await Meeting.findOne({ _id: req.params.id });
    if (oneMeeting === null) {
      // no meeting found in database
      res.status(404);
      return res.send("Meeting not found");
    }
    return res.send(oneMeeting); // meeting was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

/**
 * This method implements the logic to search for meetings created by a certain user
 *
 * @param {*} request
 * @param {*} response
 */
const findCreatorMeetings = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const createdMeetings = await Meeting.find({ creatorId: req.params.id });

    // If there are no created meetings found
    if (createdMeetings === null || createdMeetings.length === 0) {
      return res.send("No meetings by this user");
    }

    return res.send(createdMeetings);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: creator meetings search query failed!");
  }
};

/**
 * This method implements the logic to search for meetings attended by certain users
 * Method does not find meetings created by certain users.
 *
 * @param {*} request
 * @param {*} response
 */
const findUsersMeetings = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const attendedMeetings = await Meeting.find({
      userIds: req.params.id,
    });

    // If there are no attending meetings found
    if (attendedMeetings === null || attendedMeetings.length === 0) {
      return res.send("No meetings with this user as a guest user");
    }

    return res.send(attendedMeetings);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: meetings to attend search query failed!");
  }
};

/**
 * This method implements the logic to search for both meetings created by
 * and attended by an user
 *
 * @param {*} request
 * @param {*} response
 */
const findAccountMeetings = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const attendedMeetings = await Meeting.find({
      $or: [{ userIds: req.params.id }, { creatorId: req.params.id }],
    });

    // If there are no attending meetings found
    if (attendedMeetings === null || attendedMeetings.length === 0) {
      return res.send("No meetings with this user");
    }

    return res.send(attendedMeetings);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: meetings to attend search query failed!");
  }
};

/**
 * Function to find meetings with a certain name
 *
 * @param {*} request
 * @param {*} response
 */
const findNamedMeetings = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const namedMeetings = await Meeting.find({
      $or: [{ title: { $regex: req.params.text, $options: "i" } }],
    });

    return res.send(namedMeetings);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: meetings with name search query failed!");
  }
};

/**
 * Function to find meetings with a certain customer
 *
 * @param {*} request
 * @param {*} response
 */
const findCustomerMeetings = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const attendedMeetings = await Meeting.find({
      custIds: req.params.id,
    });

    // If there are no attending meetings found
    if (attendedMeetings === null || attendedMeetings.length === 0) {
      return res.send("No meetings with this customer");
    }

    return res.send(attendedMeetings);
  } catch (err) {
    // General error
    res.status(400);
    return res.send("ERROR: meetings with customer search query failed!");
  }
};

// remember to export the functions
export {
  getOneMeeting,
  findCreatorMeetings,
  findUsersMeetings,
  findAccountMeetings,
  findNamedMeetings,
  findCustomerMeetings,
};

import { Request, Response } from "express";

// import meeting schema model
import { Meeting } from "../../models/meeting";
import { User } from "../../models/user";
import { Customer } from "../../models/customer";
import { sendEmail } from "../../utils/sendEmail";
import { NEW_MEETING_TEXT } from "../../constants";

// get all demos
const getAllMeetings = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  // used unknown instead of any
  try {
    const meeting = await Meeting.find({});
    return res.send(meeting);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// handle request to create a new meeting
const createMeeting = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const newMeeting = new Meeting({
      custIds: req.body.custIds,
      creatorId: req.body.creatorId,
      userIds: req.body.userIds,
      title: req.body.title,
      location: req.body.location,
      link: req.body.link,
      start: req.body.start,
      end: req.body.end,
    });

    await Meeting.create(newMeeting);
    console.log(newMeeting);

    // email the customers with the details of the meeting
    const creator = await User.findOne({ _id: req.body.creatorId });
    for (let i = 0; i < req.body.custIds.length; i++) {
      const cust = await Customer.findOne({ _id: req.body.custIds[i] });
      let emailSubject = "New Meeting Invitation";
      if (req.body.title) {
        emailSubject = "New Meeting Invitation: " + req.body.title;
      }
      console.log(typeof req.body.start);
      await sendEmail(
        cust.email,
        emailSubject,
        NEW_MEETING_TEXT.replace("<cust>", cust.name)
          .replace("<user>", creator.name)
          .replace("<link>", req.body.link)
          .replace(
            "<date>",

            new Date(req.body.start).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
          )
          .replace("<starttime>", new Date(req.body.start).toLocaleTimeString("en-US"))
          .replace("<endtime>", new Date(req.body.end).toLocaleTimeString("en-US"))
          .replace("<email>", creator.email)
          .replace("<location>", req.body.location)
          .replace("<user>", creator.name)
      );
    }
    return res.send(newMeeting);
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("Meeting could not be created.");
  }
};

/**
 * This method implements the logic to update a meeting's details
 * updateMeeting takes a JSON document with new information if they are the creator
 *
 * @param {*} request
 * @param {*} response
 */
const updateMeeting = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    // check to see if any meeting with that id exist
    const meetingWithId = await Meeting.findOne({
      _id: req.body._id,
    });
    // If no meeting found, then user doesn't exist
    if (!meetingWithId) {
      res.status(404);
      return res.send("Meeting doesn't exist.");
    }

    // If any of the fields in the form have been filled in, update the
    // corresponding field in the customer object
    // Bit ugly if you can think of a better solution that's ideal
    if (req.body.custIds) {
      meetingWithId.custIds = req.body.custIds;
    }
    if (req.body.userIds) {
      meetingWithId.userIds = req.body.userIds;
    }
    if (req.body.title) {
      meetingWithId.title = req.body.title;
    }
    if (req.body.location) {
      meetingWithId.location = req.body.location;
    }
    if (req.body.link) {
      meetingWithId.link = req.body.link;
    }
    if (req.body.start) {
      meetingWithId.start = req.body.start;
    }
    if (req.body.end) {
      meetingWithId.end = req.body.end;
    }
    meetingWithId.save();

    return res.send(meetingWithId);
  } catch (err) {
    console.log("We have caught an error!\n");
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// remember to export the functions
export { getAllMeetings, createMeeting, updateMeeting };

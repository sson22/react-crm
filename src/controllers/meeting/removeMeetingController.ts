import { Request, Response } from "express";

// import meeting schema model
import { Meeting } from "../../models/meeting";

//handle request to delete a meeting
const deleteMeeting = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    await Meeting.deleteOne({ _id: req.body._id });
    return res.send("Meeting " + req.body._id + " has been removed");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("Meeting could not be deleted.");
  }
};

/**
 * Handle request to delete meetings created by a user
 */
const deleteMultipleMeetings = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    await Meeting.deleteMany({ creatorId: req.params.id });
    return res.send("Meetings by " + req.params.id + " has been removed");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("Meetings could not be deleted.");
  }
};

/**
 * Handle request to remove an user from all userIds lists
 */
const removeUser = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    await Meeting.updateMany({}, { $pull: { userIds: req.params.id } }, { multi: true });
    return res.send("User " + req.params.id + " has been removed from all meetings");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("User could not be removed.");
  }
};

/**
 * Handle request to remove an customer from all custIds lists
 */
const removeCustomer = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    await Meeting.updateMany({}, { $pull: { custIds: req.params.id } }, { multi: true });
    return res.send("Customer " + req.params.id + " has been removed from all meetings");
  } catch (err) {
    res.status(400);
    console.log(err);
    return res.send("Customer could not be removed.");
  }
};

// remember to export the functions
export { deleteMeeting, deleteMultipleMeetings, removeUser, removeCustomer };

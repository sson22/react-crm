import express from "express";

// require the Meeting Controller
import meetingController = require("../controllers/meeting/meetingController");
import findMeetingController = require("../controllers/meeting/findMeetingController");
import removeMeetingController = require("../controllers/meeting/removeMeetingController");

// define the router
const meetingRouter = express.Router();

/* Https requests CRUD demo resources */
meetingRouter.get("/", meetingController.getAllMeetings);
meetingRouter.get("/find-one/:id", findMeetingController.getOneMeeting);
meetingRouter.post("/create", meetingController.createMeeting);
meetingRouter.post("/update", meetingController.updateMeeting);

meetingRouter.post("/delete", removeMeetingController.deleteMeeting);
meetingRouter.post("/deleteMultiple/:id", removeMeetingController.deleteMultipleMeetings);

meetingRouter.get("/find-creator/:id", findMeetingController.findCreatorMeetings);
meetingRouter.get("/find-users/:id", findMeetingController.findUsersMeetings);
meetingRouter.get("/find-account/:id", findMeetingController.findAccountMeetings);
meetingRouter.get("/find-name/:text", findMeetingController.findNamedMeetings);
meetingRouter.get("/find-customer/:id", findMeetingController.findCustomerMeetings);

meetingRouter.post("/remove-user/:id", removeMeetingController.removeUser);
meetingRouter.post("/remove-customer/:id", removeMeetingController.removeCustomer);
/**
 * Find next x meetings
 * Remove customer from meetings
 * Remove user from meetings
 * Add customer?
 * Add user?
 */

export { meetingRouter };

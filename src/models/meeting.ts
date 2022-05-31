import mongoose = require("mongoose");

/* Create an interface representing a document in MongoDB. */
export interface MeetingInterface extends mongoose.Document {
  custIds: [string];
  creatorId: string;
  userIds: [string];
  title: string;
  location: string;
  link: string;
  start: Date;
  end: Date;
}

/* Schema for the meeting database */
export const meetingSchema = new mongoose.Schema<MeetingInterface>(
  {
    meetingId: String,
    custIds: { type: [String], required: true, default: [] },
    creatorId: { type: String, required: true },
    userIds: { type: [String], required: true, default: [] },
    title: String,
    location: String,
    link: String,
    start: Date,
    end: Date,
  },
  { collection: "Meetings" }
);

const Meeting = mongoose.model<MeetingInterface>("Meeting", meetingSchema);
export { Meeting };

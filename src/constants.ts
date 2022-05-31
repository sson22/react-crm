// TODO: this is smelly

export const CRM_NAME = "AppleCRM";

export const MONGO_URL = process.env.ATLAS_URI.replace("<username>", process.env.MONGO_USERNAME).replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

export const EMAIL_TEXT =
  "Dear <user>,\n\nHere is a link to reset your password:\n\n<link>\n\nThis link will expire in 60 minutes.";

export const REDIRECT_TEXT = "\n\nPlease note: To respond to this email, please contact the sender at <user>.";

export const NEW_MEETING_TEXT =
  "Dear <cust>,\n\nYou have a meeting scheduled with <user>. The meeting details are:\nDate: <date>\nFrom: <starttime>\nTo: <endtime>\nLocation: <location>\nLink: <link>\n\nIf you have any questions, please contact <user> at <email>.\n\nKind regards,\nAppleCRM.";

export const NEW_USER_SUBJECT = "AppleCRM Account";

export const NEW_USER =
  "Dear <user>,\n\nYour new AppleCRM Account has been created by an admin. Please log in at the link below using the details down below, and change your password after the first log in on your profile page. Please contact your manager if there are any issues.\n\nEmail: <email>\nPassword: <password>\nLink: <link>\n\nThis email was automatically generated, and replies won't be seen. If this email was sent to you by mistake, please contact AppleCRM and then delete this email and all copies.";

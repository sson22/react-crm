import "dotenv/config";
import mongoose from "mongoose";
import * as constants from "./constants";

mongoose.connect(constants.MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: constants.CRM_NAME,
});

const db = mongoose.connection;

db.on("error", (err: Error) => {
  console.error(err);
  process.exit(1);
});

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port);
});

/* Add the schema in here */
require("./models/customer");
require("./models/user");
require("./models/meeting");

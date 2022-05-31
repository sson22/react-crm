import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

require("./database");

/* Import routers here */
import { custRouter } from "./routes/custRouter";
import { userRouter } from "./routes/userRouter";
import { meetingRouter } from "./routes/meetingRouter";

import MongoStore from "connect-mongo";

/* Passport & Sessions initialisation */
import passport from "passport";
import "./config/passport";

/* Setting up sessions to store user information */
import session from "express-session";

import * as constants from "./constants";

/* Import express and choose the port number */
const app = express();
const port = process.env.PORT || 3001;

/* Set the body parser - using express as bodyParser is deprecated*/
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");

//   // Pass to next layer of middleware
//   next();
// });

const whitelist = ["http://localhost:3000", "http://localhost:3001", "https://applecrm.herokuapp.com"];
const corsOptions = {
  origin: function (origin: string, callback: (arg0: Error, arg1: boolean) => void) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
};
app.use(
  cors({
    credentials: true,
    //origin: "http://localhost:3000",
    origin: process.env.ORIGIN_URL,
  })
);

app.use(
  session({
    name: "passport",
    secret: process.env.PASSPORT_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: constants.MONGO_URL,
    }),
  })
);
/* middleware for passport to initialise */
app.use(passport.initialize());

/* middleware to store the user object in the session */
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../client/build")));

/* Route initialisations */
app.use("/customer", custRouter);
app.use("/users", userRouter);
app.use("/meetings", meetingRouter);

// Send remaining requests to React app
app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
// app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use('/', express.static('../client/build/'));

/* Server has been initialised! */
app.listen(port, () => console.log(`Listening on port ${port}...`));

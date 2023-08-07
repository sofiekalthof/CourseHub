require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoDBstore = require("connect-mongodb-session")(session);

// Define port
const port = 3600;

// Create Express app
const app = express();

// magic?
app.set("trust proxy", 1);

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://64d0afd3f1f1824bc2e8aa63--guileless-souffle-4833ce.netlify.app",
    "https://main--guileless-souffle-4833ce.netlify.app",
    "https://guileless-souffle-4833ce.netlify.app",
  ],
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true, // needed to allow cookies to be sent between frontend/backend
};

// Add CORS to all routes and methods
app.use(cors(corsOptions));

// Enable parsing of JSON bodies
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// enable static content
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// allow connect-mongodb-session library to save sessions under mySessions collection
const mongoDBstore = new MongoDBstore({
  uri: process.env.MONGODB_URL,
  databaseName: process.env.DB_NAME,
  collection: "userSessions",
});

// Add express-session to all routes
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    name: "session-id", // name of the cookies (key field)
    store: mongoDBstore,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_LENGTH), // Max. session length
      sameSite: parseInt(process.env.PROD) === 0 ? false : "none", // same-site and cross-site(diff. schemes, domain or sub-domain) requests
      secure: parseInt(process.env.PROD) === 0 ? false : true, // need an HTTPS enabled browser (true-> in prod.)
    },
    resave: false, // !!! true - force session to be saved in session store, even if it was not modified during a request
    saveUninitialized: false, // dont save session if it was not modified (i.e. no login yet)
    unset: "destroy", // delete cookie from db when it is null(completes task in a few minutes)
  })
);

// using routes
const courseHubRoutes = require("./routes/courseHubRoutes.js");
app.use("/", courseHubRoutes);

// start listening to the port
app.listen(port, () => {
  console.log("Listening on " + port + ".");
});

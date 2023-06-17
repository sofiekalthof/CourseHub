const express = require("express");
const cors = require("cors")
require('dotenv').config();
const UserModel = require("./models/dbUserSchema.js");

// Define port
const port = 3600;

// Create Express app
const app = express();

// Add CORS to all routes and methods
app.use(cors());

// Enable parsing of JSON bodies
app.use(express.json());

// start listening to the port
app.listen(port, () => {
    console.log("Listening on " + port + ".");
  }); 

// Get a all users
// app.route("/").get(async (req, res) => {
//     let users = [];
//     try{
//         users = await UserModel.find({});
//       res.status(200).json(users);
//     } catch(err) {
//       res.status(500).send("Server error. Request could not be fulfilled.");
//     }
// });

// Get a specific user
app.route("/:email").get(async (req, res) => {
    const email = req.params.email;

    try{
      const result = await UserModel.findOne({ email: email });

      if (!result) {
        res.status(404).json({ error: "Searched user not found" });
        return;
      }
      res.status(200).json(result);
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
});

// Create a new user
app.route("/").post(async (req, res) => {
    const doc = new UserModel(req.body);

    try {
      await doc.save();
      
      res.status(200).json({ message: "New User created" });
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
  });

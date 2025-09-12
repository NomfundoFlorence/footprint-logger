const { client, connectDatabase } = require("../models/db");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// app.set("views", path.join(__dirname, "../views"));
// app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

const cors = require("cors");

// Allow requests from your frontend (Vite React) on port 5173
app.use(
  cors({
    origin: "http://localhost:5173",
    // credentials: true, // only needed if you’re sending cookies
  })
);

app.get("/", async (req, res) => {
  res.send("Inside the server");
});

// app.get("/signup", (req, res) => {
//   res.render("signup", { title: "Sign Up" });
// });
// app.get("/login", (req, res) => {
//   res.render("login", { title: "Log In" });
// });
// app.get("/logger", (req, res) => {
//   res.render("footprint_logger", { title: "Logger" });
// });

app.post("/signup", async (req, res) => {
  console.log("I got here");

  const { firstName, lastName, email, password } = req.body;

  try {
    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("users");

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
    });

    // res.redirect("/login");
    res.status(200).json({ message: "Signed up successfully!" });
  } catch (error) {
    console.error("Failed to sign user up", error);
    res.status(500).json({ message: "Failed to signup", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("users");

    const user = await collection.findOne({ email: email });

    if (user) {
      const pwdResult = await bcrypt.compare(password, user.password);

      if (!pwdResult) {
        return res.status(401).send("Invalid credentials!"); // authorization failure not unavailable resources
      }

      const payload = {
        user: {
          id: user._id.toString(),
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      const userEmail = user.email;

      return res.status(200).json({ authToken, userEmail });
    } else {
      return res.status(404).json("No user found!");
    }
  } catch (error) {
    console.error("Failed to log in", error);
    res.status(500).send("Failed to log in");
  }
});

// app.post("/emissions", (req, res) =>{

// })

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

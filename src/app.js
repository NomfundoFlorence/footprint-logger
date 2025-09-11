const { client, connectDatabase } = require("./db");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", async (req, res) => {
  res.send("Inside the server");
});

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});
app.get("/login", (req, res) => {
  res.render("login", { title: "Log In" });
});

app.get("/logger", (req, res) => {
  res.render("footprint_logger", { title: "Logger" });
});

app.post("/signup", async (req, res) => {
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

    res.redirect("/login");
  } catch (error) {
    console.error("Failed to sign user up", error);
    res.send("Failed to signup!");
  }
});

app.post("/login", async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;

    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("users");

    const user = await collection.findOne({ email: email });

    if (user) {
      const pwdResult = await bcrypt.compare(password, user.password);

      if (!pwdResult) {
        res.status(401).send("Invalid credentials!"); // authorization failure not unavailable resources
      }

      const payload = {
        user: {
          id: user._id.toString(),
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      const userEmail = user.email;

      // res.json({ authToken, userEmail });

      res.cookie("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.redirect("/logger");
    } else {
      res.send("No user found!");
    }
  } catch (error) {
    console.error("Failed to log in", error);
    res.status(500).send("Failed to log in");
  }
  // res.json(req.body);
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

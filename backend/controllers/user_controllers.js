const { client, connectDatabase } = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already taken. Try logging in" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
    });

    res.status(200).json({ message: "Signed up successfully! Redirecting..." });
  } catch (error) {
    console.error("Failed to sign user up", error);
    res.status(500).json({ message: "Failed to signup", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("users");

    const user = await collection.findOne({ email: email });

    if (user) {
      const pwdResult = await bcrypt.compare(password, user.password);

      if (!pwdResult) {
        return res
          .status(401)
          .send({ message: "Invalid credentials. Try again" });
      }

      const payload = {
        user: {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      const firstName = user.firstName;
      const userEmail = user.email;

      return res.status(200).json({ authToken, firstName, userEmail, message: "You will be redirected soon..." });
    } else {
      return res
        .status(404)
        .json({ message: "Invalid credentials. Try again" });
    }
  } catch (error) {
    console.error("Failed to log in", error);
    res.status(500).send("Failed to log in");
  }
};

module.exports = { signup, login };

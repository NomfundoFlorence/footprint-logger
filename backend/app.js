const express = require("express");
const bcrypt = require("bcrypt");

const { client, connectDatabase } = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  // await connectDatabase();
  res.send("Inside the server");
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    await connectDatabase();
    const db = client.database("footprintLogger");
    const collection = db.collection("users");

    const saltRounds = 10;
    const hashPassword = bcrypt.hash(password, saltRounds);

    collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
    });
    res.send("Signup successfully");
  } catch (error) {
    console.error("Failed to sign user up", error);
    res.send("Failed to signup!");
  }
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

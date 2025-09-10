const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const { client, connectDatabase } = require("./db");

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(express.json());
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

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    await connectDatabase();
    const db = client.database("footprintLogger");
    const collection = db.collection("users");

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await collection.insertOne({
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

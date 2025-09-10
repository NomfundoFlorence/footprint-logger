const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const { client, connectDatabase } = require("./db");

const app = express();
const PORT = 3000;

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
        res.status(404).send("Incorrect password!");
      } else {
        res.status(200).send("Logged in successfully!");
      }
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

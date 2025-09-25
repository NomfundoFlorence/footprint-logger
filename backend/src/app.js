const { client, connectDatabase } = require("../models/db");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("../routes/user_routes");

const app = express();

const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/", userRoutes);

app.get("/", async (_req, res) => {
  res.send("Inside the server");
});

// app.post("/signup", async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   try {
//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("users");

//     const existingUser = await collection.findOne({ email: email });

//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     const saltRounds = 10;
//     const hashPassword = await bcrypt.hash(password, saltRounds);

//     await collection.insertOne({
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: hashPassword,
//     });

//     res.status(200).json({ message: "Signed up successfully!" });
//   } catch (error) {
//     console.error("Failed to sign user up", error);
//     res.status(500).json({ message: "Failed to signup", error: error.message });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("users");

//     const user = await collection.findOne({ email: email });

//     if (user) {
//       const pwdResult = await bcrypt.compare(password, user.password);

//       if (!pwdResult) {
//         return res.status(401).send("Invalid credentials!");
//       }

//       const payload = {
//         user: {
//           id: user._id.toString(),
//           name: `${user.firstName} ${user.lastName}`,
//         },
//       };

//       const authToken = jwt.sign(payload, JWT_SECRET);
//       const firstName = user.firstName;
//       const userEmail = user.email;

//       return res.status(200).json({ authToken, firstName, userEmail });
//     } else {
//       return res.status(404).json("No user found!");
//     }
//   } catch (error) {
//     console.error("Failed to log in", error);
//     res.status(500).send("Failed to log in");
//   }
// });

// function authenticate(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded.user;

//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// }

// app.post("/logger", authenticate, async (req, res) => {
//   try {
//     const { email, category, activity, emission } = req.body;

//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("emissions");

//     const newEntry = {
//       userId: req.user.id,
//       email: email,
//       name: req.user.name,
//       category: category,
//       activity: activity,
//       emission: emission,
//       date_logged: new Date().toISOString().slice(0, 10),
//     };

//     const newLog = await collection.insertOne(newEntry);
//     const postedLog = await collection.findOne({ _id: newLog.insertedId });

//     res
//       .status(200)
//       .json({ message: "Activity logged successfully!", postedLog });
//   } catch (err) {
//     console.error("Failed to submit", err);
//   }
// });

// app.get("/user-logs", authenticate, async (req, res) => {
//   try {
//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("emissions");

//     const result = await collection
//       .find({ userId: req.user.id })
//       .sort({ _id: -1 })
//       .toArray();

//     res.status(200).json({ message: "Logs retrieved successfully!", result });
//   } catch (err) {
//     console.error("Server error: ", err);
//     res.status(500).json({ message: "could not fetch data: ", err });
//   }
// });

// app.get("/users-average", async (_req, res) => {
//   try {
//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("emissions");

//     const result = await collection
//       .aggregate([
//         { $addFields: { emissionNum: { $toDouble: "$emission" } } },
//         {
//           $group: {
//             _id: "$userId",
//             totalPerUser: { $sum: "$emissionNum" },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             sumEmissions: { $sum: "$totalPerUser" },
//             numUsers: { $sum: 1 },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             averageEmission: { $divide: ["$sumEmissions", "$numUsers"] },
//           },
//         },
//       ])
//       .toArray();

//     res.status(200).json({ message: "Data retrieved successfully!", result });
//   } catch (err) {
//     console.error("Server error: ", err);
//     res.status(500).json({ message: "could not fetch data: ", err });
//   }
// });

// app.get("/leaderboard", async (_req, res) => {
//   try {
//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("emissions");

//     const topTen = await collection
//       .aggregate([
//         {
//           $addFields: {
//             emissionNum: { $toDouble: "$emission" },
//           },
//         },
//         {
//           $group: {
//             _id: "$userId",
//             name: { $last: "$name" },
//             totalEmissions: { $sum: "$emissionNum" },
//           },
//         },
//         {
//           $sort: { totalEmissions: 1 },
//         },
//         {
//           $limit: 10,
//         },
//       ])
//       .toArray();
//     res
//       .status(200)
//       .json({ message: "Top 10 retrieved successfully!", data: topTen });
//   } catch (err) {
//     console.error("Could not fetch top 10.");
//     res.status(500).json({ message: "Server error", err });
//   }
// });

// app.post("/weekly-goals", authenticate, async (req, res) => {
//   try {
//     const { category, goal } = req.body;

//     if (!category || !goal) {
//       return res
//         .status(400)
//         .json({ message: "Category and goal are required" });
//     }

//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("weekly_goals");

//     const latestGoal = await collection
//       .find({ userId: req.user.id })
//       .sort({ createdAt: -1 })
//       .limit(1)
//       .toArray();

//     if (latestGoal.length > 0) {
//       const lastGoalDate = new Date(latestGoal[0].createdAt);
//       const now = new Date();
//       const daysSinceLastGoal =
//         (now.getTime() - lastGoalDate.getTime()) / (1000 * 60 * 60 * 24);

//       if (daysSinceLastGoal < 7) {
//         return res.status(403).json({
//           message: `You can only set a new goal after 7 days. Try again in ${Math.ceil(
//             7 - daysSinceLastGoal
//           )} day(s).`,
//         });
//       }
//     }

//     const newGoal = {
//       userId: req.user.id,
//       name: req.user.name,
//       category,
//       goal: Number(goal),
//       createdAt: new Date(),
//     };

//     const result = await collection.insertOne(newGoal);

//     res.status(200).json({
//       message: "Weekly goal set successfully!",
//       goal: newGoal,
//     });
//   } catch (err) {
//     console.error("Failed to post weekly goal", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// app.get("/weekly-goals", authenticate, async (req, res) => {
//   try {
//     await connectDatabase();
//     const db = client.db("footprint_logger");
//     const collection = db.collection("weekly_goals");

//     const latestGoal = await collection
//       .find({ userId: req.user.id })
//       .sort({ createdAt: -1 })
//       .limit(1)
//       .toArray();

//     if (latestGoal.length === 0) {
//       return res.status(404).json({ message: "No weekly goal set yet" });
//     }

//     res.status(200).json({
//       message: "Weekly goal retrieved successfully!",
//       goal: latestGoal[0],
//     });
//   } catch (err) {
//     console.error("Failed to fetch weekly goal", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// const tips = {
//   transportation:
//     "Try cycling twice this week instead of driving to cut ~2kg CO₂",
//   "food-consumption":
//     "Add two plant-based meals this week to lower your footprint",
//   "energy-use": "Switch off unused appliances and save ~1kg CO₂",
//   other: "Consider buying second-hand or reusing items to cut waste",
// };

// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;

//   if (!token) {
//     return next(new Error("Authentication error: No token provided"));
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     socket.user = decoded.user; // attach user info
//     next();
//   } catch (err) {
//     next(new Error("Authentication error: Invalid token"));
//   }
// });

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   socket.on("getWeeklyGoals", async () => {
//     try {
//       await connectDatabase();
//       const db = client.db("footprint_logger");
//       const collection = db.collection("emissions");

//       const results = await collection
//         .aggregate([
//           { $match: { userId: socket.user.id } },
//           { $addFields: { emissionNum: { $toDouble: "$emission" } } },
//           {
//             $group: {
//               _id: "$category",
//               totalEmissions: { $sum: "$emissionNum" },
//             },
//           },
//           { $sort: { totalEmissions: -1 } },
//           { $limit: 1 },
//         ])
//         .toArray();

//       const topCategory = results[0] || null;

//       if (topCategory) {
//         const tip =
//           tips[topCategory._id.toLowerCase()] ||
//           "Great job! Keep making small changes for a big impact.";

//         socket.emit("weeklyGoalsData", {
//           category: topCategory._id,
//           totalEmissions: topCategory.totalEmissions,
//           tip,
//         });
//       } else {
//         socket.emit("weeklyGoalsData", null);
//       }
//     } catch (err) {
//       console.error("Error fetching weekly goals:", err);
//       socket.emit("weeklyGoalsData", null);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

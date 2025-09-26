const { client, connectDatabase } = require("../models/db");
const jwt = require("jsonwebtoken");
const express = require("express");
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
// app.use(express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/", userRoutes);

app.get("/", async (_req, res) => {
  res.send("Inside the server");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const tips = {
  transportation:
    "Try cycling twice this week instead of driving to cut ~2kg CO₂",
  "food-consumption":
    "Add two plant-based meals this week to lower your footprint",
  "energy-use": "Switch off unused appliances and save ~1kg CO₂",
  other: "Consider buying second-hand or reusing items to cut waste",
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded.user;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  // eslint-disable-next-line no-console
  console.log("Client connected:", socket.id);

  socket.on("getWeeklyGoals", async () => {
    try {
      await connectDatabase();
      const db = client.db("footprint_logger");
      const collection = db.collection("emissions");

      const results = await collection
        .aggregate([
          { $match: { userId: socket.user.id } },
          { $addFields: { emissionNum: { $toDouble: "$emission" } } },// grep-ignore
          {
            $group: {
              _id: "$category",
              totalEmissions: { $sum: "$emissionNum" },
            },
          },
          { $sort: { totalEmissions: -1 } },
          { $limit: 1 },
        ])
        .toArray();

      const topCategory = results[0] || null;

      if (topCategory) {
        const tip =
          tips[topCategory._id.toLowerCase()] ||
          "Great job! Keep making small changes for a big impact.";

        socket.emit("weeklyGoalsData", {
          category: topCategory._id,
          totalEmissions: topCategory.totalEmissions,
          tip,
        });
      } else {
        socket.emit("weeklyGoalsData", null);
      }
    } catch (err) {
      console.error("Error fetching weekly goals:", err);
      socket.emit("weeklyGoalsData", null);
    }
  });

  socket.on("disconnect", () => {
    // eslint-disable-next-line no-console
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

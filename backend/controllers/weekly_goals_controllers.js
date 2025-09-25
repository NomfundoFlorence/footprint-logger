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

const weeklyGoalSetter = async (req, res) => {
  try {
    const { category, goal } = req.body;

    if (!category || !goal) {
      return res
        .status(400)
        .json({ message: "Category and goal are required" });
    }

    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("weekly_goals");

    const latestGoal = await collection
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (latestGoal.length > 0) {
      const lastGoalDate = new Date(latestGoal[0].createdAt);
      const now = new Date();
      const daysSinceLastGoal =
        (now.getTime() - lastGoalDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLastGoal < 7) {
        return res.status(403).json({
          message: `You can only set a new goal after 7 days. Try again in ${Math.ceil(
            7 - daysSinceLastGoal
          )} day(s).`,
        });
      }
    }

    const newGoal = {
      userId: req.user.id,
      name: req.user.name,
      category,
      goal: Number(goal),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newGoal);

    res.status(200).json({
      message: "Weekly goal set successfully!",
      goal: newGoal,
    });
  } catch (err) {
    console.error("Failed to post weekly goal", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const weeklyGoal = async (req, res) => {
  try {
    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("weekly_goals");

    const latestGoal = await collection
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (latestGoal.length === 0) {
      return res.status(404).json({ message: "No weekly goal set yet" });
    }

    res.status(200).json({
      message: "Weekly goal retrieved successfully!",
      goal: latestGoal[0],
    });
  } catch (err) {
    console.error("Failed to fetch weekly goal", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { weeklyGoalSetter, weeklyGoal };

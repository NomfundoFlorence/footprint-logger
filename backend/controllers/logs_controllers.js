const { client, connectDatabase } = require("../models/db");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const logger = async (req, res) => {
  try {
    const { email, category, activity, emission } = req.body;

    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("emissions");

    const newEntry = {
      userId: req.user.id,
      email: email,
      name: req.user.name,
      category: category,
      activity: activity,
      emission: emission,
      date_logged: new Date().toISOString().slice(0, 10),
    };

    const newLog = await collection.insertOne(newEntry);
    const postedLog = await collection.findOne({ _id: newLog.insertedId });

    res
      .status(200)
      .json({ message: "Activity logged successfully!", postedLog });
  } catch (err) {
    console.error("Failed to submit", err);
  }
};

const userLogs = async (req, res) => {
  try {
    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("emissions");

    const result = await collection
      .find({ userId: req.user.id })
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ message: "Logs retrieved successfully!", result });
  } catch (err) {
    console.error("Server error: ", err);
    res.status(500).json({ message: "could not fetch data: ", err });
  }
};

module.exports = { logger, userLogs };

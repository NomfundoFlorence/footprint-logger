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

const usersAverage = async (_req, res) => {
  try {
    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("emissions");

    const result = await collection
      .aggregate([
        { $addFields: { emissionNum: { $toDouble: "$emission" } } },
        {
          $group: {
            _id: "$userId",
            totalPerUser: { $sum: "$emissionNum" },
          },
        },
        {
          $group: {
            _id: null,
            sumEmissions: { $sum: "$totalPerUser" },
            numUsers: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            averageEmission: { $divide: ["$sumEmissions", "$numUsers"] },
          },
        },
      ])
      .toArray();

    res.status(200).json({ message: "Data retrieved successfully!", result });
  } catch (err) {
    console.error("Server error: ", err);
    res.status(500).json({ message: "could not fetch data: ", err });
  }
};

module.exports = { usersAverage };

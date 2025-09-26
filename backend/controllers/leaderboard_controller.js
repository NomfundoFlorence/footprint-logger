const { client, connectDatabase } = require("../models/db");
require("dotenv").config();

const leaderboard = async (_req, res) => {
  try {
    await connectDatabase();
    const db = client.db("footprint_logger");
    const collection = db.collection("emissions");

    const topTen = await collection
      .aggregate([
        {
          $addFields: {
            emissionNum: { $toDouble: "$emission" },
          },
        },
        {
          $group: {
            _id: "$userId",
            name: { $last: "$name" },
            totalEmissions: { $sum: "$emissionNum" },
          },
        },
        {
          $sort: { totalEmissions: 1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();
    res
      .status(200)
      .json({ message: "Top 10 retrieved successfully!", data: topTen });
  } catch (err) {
    console.error("Could not fetch top 10.");
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = { leaderboard };

const express = require("express");
const router = express.Router();
const Lead = require("../models/lead.model");

// 1. GET /report/last-week — Leads closed in last 7 days
router.get("/last-week", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const closedLeads = await Lead.find({
      status: "Closed",
      $or: [
        { closedAt: { $gte: oneWeekAgo } },
        { updatedAt: { $gte: oneWeekAgo } }
      ]
    }).populate("salesAgent", "name email");

    res.status(200).json({ leads: closedLeads });
  } catch (err) {
    console.error("Error in /report/last-week:", err);
    res.status(500).json({ error: "Something went wrong from server." });
  }
});

// 2. GET /report/pipeline — Total leads in pipeline grouped by status
router.get("/pipeline", async (req, res) => {
  try {
    const leads = await Lead.find({
      status: { $ne: "Closed" }
    }).populate("salesAgent", "name email");

    res.status(200).json({ leads });
  } catch (err) {
    console.error("Error in /report/pipeline:", err);
    res.status(500).json({ error: "Something went wrong from server." });
  }
});

// 3. GET /report/closed-by-agent — Leads closed per sales agent
router.get("/closed-by-agent", async (req, res) => {
  try {
    const closedLeads = await Lead.aggregate([
      { $match: { status: "Closed" } },
      {
        $lookup: {
          from: "salesagents",
          localField: "salesAgent",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
      {
        $group: {
          _id: "$agent.name",
          closedLeads: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(closedLeads);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});
module.exports = router;

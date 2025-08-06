const express = require("express");
const router = express.Router();
const Lead = require("../models/lead.model");

// 1. GET /report/last-week — Leads closed in last 7 days
router.get("/last-week", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    const todaysDate = new Date();
    oneWeekAgo.setDate(todaysDate.getDate() - 7);

    const closedLeads = await Lead.find({
      status: "Closed",
      updatedAt: { $gte: oneWeekAgo }
    });

    res.status(200).json({ leads: closedLeads });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});

// 2. GET /report/pipeline — Total leads in pipeline grouped by status
router.get("/pipeline", async (req, res) => {
  try {
    const pipelineLeads = await Lead.find({
      status: { $ne: "Closed" }
    });

    res.status(200).json({ leads: pipelineLeads });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});


// 3. GET /report/closed-by-agent — Leads closed per sales agent
router.get("/closed-by-agent", async (req, res) => {
  try {
    const leads = await Lead.find({
      status: "Closed",
      closedBy: "agent"
    });
    res.status(200).json({ leads });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});


module.exports = router;

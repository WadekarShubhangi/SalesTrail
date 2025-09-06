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
      closedAt: { $gte: oneWeekAgo }
    });

    res.status(200).json({ leads: closedLeads });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});

// 2. GET /report/pipeline — Total leads in pipeline grouped by status
router.get("/pipeline", async (req, res) => {
  try {
    const totalLeadsInPipeline  = await Lead.find({
      status: { $ne: "Closed" }
    });

    res.status(200).json({ totalLeadsInPipeline  });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});


// 3. GET /report/closed-by-agent — Leads closed per sales agent
router.get("/closed-by-agent", async (req, res) => {
  try {
    const closedLeads = await Lead.aggregate([
      { $match: { status: "Closed" } },
      { $group: { _id: "$salesAgent.name", closedLeads: { $sum: 1 } } }
    ]);

    res.status(200).json(closedLeads);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong from server." });
  }
});



module.exports = router;

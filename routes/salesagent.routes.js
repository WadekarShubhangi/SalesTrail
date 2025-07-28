const express = require("express");
const router = express.Router();
const SalesAgent = require("../models/salesagent.model");

// GET /agents
async function readAllAgents() {
  try {
    const agents = await SalesAgent.find();
    return agents;
  } catch (error) {
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const agents = await readAllAgents();
    if (agents.length != 0) {
      res.status(200).json({ agents });
    } else {
      res.status(404).json({ error: "No Sales Agent found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Sales Agents." });
  }
});

// POST /agents
async function addSalesAgent({name, email}) {
  try {
    const newSalesAgent = new SalesAgent({ name, email });
    return await newSalesAgent.save();
  } catch (error) {
    throw error;
  }
}

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const existingAgent = await SalesAgent.findOne({ email });

    if (!name || !email) {
      res.status(404).json({
        message: "Name and Email id required.",
      });
    } else if (existingAgent) {
      res.status(409).json({
        message: "Agent with this email already exists.",
      });
    } else {
      const newAgent = await addSalesAgent({ name, email });
      res.status(201).json({
        message: "Sales Agent added successfully.",
        newAgent,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});
module.exports = router;

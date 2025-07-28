const express = require("express");
const router = express.Router();
const Lead = require("../models/lead.model");

// GET /leads
async function readAllLeads() {
  try {
    const leads = await Lead.find().populate("salesAgent");
    return leads;
  } catch (error) {
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const leads = await readAllLeads();
    if (leads.length != 0) {
      res.status(200).json({ leads });
    } else {
      res.status(404).json({ error: "No Leads found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching leads." });
  }
});

// POST /leads
async function addNewLead(leadData) {
  try {
    const newLead = new Lead(leadData);
    return await newLead.save();
  } catch (error) {
    throw error;
  }
}

router.post("/", async (req, res) => {
     const { name, source, salesAgent, status, tags, timeToClose, priority } = req.body;

  if (!name || !salesAgent || !status || !source || !timeToClose || !priority) {
    return res.status(400).json({ error: "Required fields missing in request body." });
  }
  try {
    const newLead = await addNewLead(req.body);
    res.status(201).json({ lead: newLead });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error while fetching leads." });
  }
});

// PATCH /leads

async function updateLeads(id, dataToUpdate){
  try {
    const updatedLead = await Lead.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    });
    return updatedLead;
  } catch (error) {
    throw error;
  }
}

router.patch("/:id", async(req, res) => {
  try {
      const updatedLead = await updateLeads(req.params.id, req.body);
    if (updatedLead) {
      res.status(200).json({
        message: "Lead updated successfully.",
        lead: updatedLead,
      });
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead." });
  }
})

// DELETE /Leads
async function deleteLeadById(leadId) {
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    return deletedLead;
  } catch (error) {
    throw error;
  }
}


router.delete("/:id", async (req, res) => {
  try {
    const deletedLead = await deleteLeadById(req.params.id);
    if (deletedLead) {
      res.status(200).json({
        message: "Lead deleted successfully.",
        lead: deletedLead,
      });
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead." });
  }
});

module.exports = router;

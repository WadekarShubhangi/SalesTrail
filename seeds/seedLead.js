const fs = require("fs");
const Lead = require("../models/lead.model");
const jsonData = fs.readFileSync("lead.json", "utf-8");
const leadData = JSON.parse(jsonData);

async function seedLead() {
  try {
    for (const lead of leadData) {
      const newLead = new Lead({
        name: lead.name,
        source: lead.source,
        salesAgent: lead.salesAgent,
        status: lead.status,
        tags: lead.tags,
        timeToClose: lead.timeToClose,
        priority: lead.priority,
      });
      await newLead.save();
      console.log(`Leads: ${newLead.name}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = seedLead;

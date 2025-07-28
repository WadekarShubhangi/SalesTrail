const fs = require("fs")
const SalesAgent = require("../models/salesagent.model.js")
const jsonData = fs.readFileSync('salesAgent.json', 'utf-8');
const salesAgentData = JSON.parse(jsonData);

async function seedSalesAgent() {
    try {
        for (const agent of salesAgentData) {
            const newSalesAgent = new SalesAgent({
                name: agent.name,
                email: agent.email,
            });
            await newSalesAgent.save();
            console.log(`SalesAgentName: , ${newSalesAgent.name}`)
        }
        console.log("Seeding Completed.")
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

module.exports = seedSalesAgent;
const fs = require("fs");
const Tag = require("../models/tag.model");
const jsonData = fs.readFileSync("tags.json", "utf-8");
const tagData = JSON.parse(jsonData);

async function seedTag() {
  try {
    for (const tag of tagData) {
      const newTag = new Tag({
       name: tag.name,
      });
      await newTag.save();
      console.log(`Tags: ${newTag.name}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

module.exports = seedTag;

const express = require("express");
const router = express.Router();
const Tag = require("../models/tag.model");

// POST - Add new tag
async function addNewTag(tagData) {
  try {
    const newTag = new Tag(tagData);
    return await newTag.save();
  } catch (error) {
    throw error;
  }
}

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tag name is required." });
  }

  try {
    const createdTag = await addNewTag({ name });
    res.status(201).json({ message: "Tag created successfully.", tag: createdTag });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Tag already exists." });
    } else {
      res.status(500).json({ error: "Failed to create tag." });
    }
  }
});

// GET - Get all tags
async function readAllTags() {
  try {
    const tags = await Tag.find({});
    return tags;
  } catch (error) {
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const tags = await readAllTags();
    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags." });
  }
});

module.exports = router;

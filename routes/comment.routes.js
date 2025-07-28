const express = require("express");
const router = express.Router();
const Comment = require("../models/comment.model");

async function readAllComments(commentData) {
    const { id } = commentData;
  try {
    const allComments = await Comment.find({lead : id})
      .populate("lead")
      .populate("author");
    return allComments;
  } catch (error) {
    throw error;
  }
}
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await readAllComments(req.params);
    if (comments.length != 0) {
      res.status(200).json({ comments: comments });
    } else {
      res.status(404).json({ error: "No comments founds." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching comments." });
  }
});


async function addCommentToLead(commentData) {
  const { leadId, author, commentText } = commentData;

  try {
    const newComment = new Comment({
      lead: leadId,
      author,
      commentText,
    });
    return await newComment.save();
  } catch (error) {
    throw error;
  }
}

router.post("/:id/comments", async (req, res) => {
  const { commentText, author } = req.body;
  const leadId = req.params.id;

  if (!commentText || !author) {
    return res.status(400).json({ error: "Author and commentText are required." });
  }

  try {
    const newComment = await addCommentToLead({ leadId, author, commentText });
    res.status(201).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment." });
  }
});

module.exports = router;

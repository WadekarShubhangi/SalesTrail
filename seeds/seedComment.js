const fs = require("fs")
const Comments = require("../models/comment.model")
const jsonData = fs.readFileSync("comments.json", "utf-8")
const commentsData = JSON.parse(jsonData);

async function seedComment() {
    try {
        for (const comment of commentsData) {
            const newComment = new Comments({
                lead: comment.lead,
                author: comment.author,
                commentText: comment.commentText,
            })
            await newComment.save();
            console.log(`Comments lead: ${newComment.lead}`)
        }
        console.log("Seeding Completed.")
    } catch (error) {
       console.log("Error occured while seeding comments.") 
    }
}

module.exports = seedComment;
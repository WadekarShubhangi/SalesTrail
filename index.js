// const seedSalesAgent = require("./seeds/seedSalesAgent");
// const seedLead = require("./seeds/seedLead");
// const seedComment = require("./seeds/seedComment")
// const seedTag = require("./seeds/seedTag")

const {initializeDatabase} = require("./db/db.connect");
initializeDatabase();
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
const salesagentRoutes = require("./routes/salesagent.routes");
const leadRoutes = require("./routes/lead.routes")
const commentRoutes = require("./routes/comment.routes")
const tagRoutes = require("./routes/tag.routes");
const reportRoutes = require("./routes/report.routes");

// seedSalesAgent();
// seedLead();
// seedComment();
// seedTag();

app.get("/", (req, res) => {
  res.send("API is running");
});
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/agents", salesagentRoutes);
app.use("/leads", leadRoutes)
app.use("/leads", commentRoutes)
app.use("/tags", tagRoutes);
app.use("/report", reportRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
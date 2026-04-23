require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/videos", require("./routes/videoRoutes"));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
/* app.get("/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const state = mongoose.connection.readyState;

    res.json({
      dbState: state === 1 ? "Connected ✅" : "Not Connected ❌",
      readyState: state,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}); */

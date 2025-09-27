const express = require("express");
const cors = require("cors");
const incidentsRouter = require("./routes/incidents"); // make sure this file exists

const app = express();

// Allow requests only from frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Parse JSON requests
app.use(express.json());

// Mount API routes
app.use("/api/incidents", incidentsRouter);

// Default route (optional) to check server
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

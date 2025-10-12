import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import gmailRoutes from "./routes/gmailRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Check if credentials file exists
const credentialsPath = path.join(process.cwd(), "credentials.json");

if (!fs.existsSync(credentialsPath)) {
  console.error("credentials.json file not found!");
  console.error("Please download your Google OAuth credentials and place them in the project root as 'credentials.json'");
  console.error("You can get credentials from: https://console.cloud.google.com/apis/credentials");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/gmail", gmailRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Gmail Summarizer API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/gmail/health",
      test: "GET /api/gmail/test",
      labels: "GET /api/gmail/labels",
      labelById: "GET /api/gmail/labels/:labelId"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: "Something went wrong"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: "The requested endpoint does not exist"
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Gmail API endpoints available at http://localhost:${PORT}/api/gmail`);
  console.log(`Health check: http://localhost:${PORT}/api/gmail/health`);
  console.log(`List labels: http://localhost:${PORT}/api/gmail/labels`);
  console.log(`Note: Google OAuth will use port 3000 for authentication flow`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
    console.error('You can kill the process with: lsof -ti:3002 | xargs kill -9');
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

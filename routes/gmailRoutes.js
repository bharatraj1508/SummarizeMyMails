import express from "express";
import gmailController from "../controllers/gmailController.js";

const router = express.Router();

// Health check route
router.get("/health", gmailController.healthCheck);

// Test route (no authentication required)
router.get("/test", gmailController.testEndpoint);

// Get all labels
router.get("/labels", gmailController.getLabels);

// Get a specific label by ID
router.get("/labels/:labelId", gmailController.getLabelById);

export default router;

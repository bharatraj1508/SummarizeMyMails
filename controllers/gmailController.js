import gmailService from "../services/gmailService.js";

class GmailController {
  async getLabels(req, res) {
    try {
      const labels = await gmailService.listLabels();

      res.status(200).json({
        success: true,
        data: labels,
        count: labels.length,
        message:
          labels.length > 0
            ? "Labels retrieved successfully"
            : "No labels found",
      });
    } catch (error) {
      console.error("Error in getLabels controller:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve labels",
      });
    }
  }

  async getLabelById(req, res) {
    try {
      const { labelId } = req.params;

      if (!labelId) {
        return res.status(400).json({
          success: false,
          error: "Label ID is required",
          message: "Please provide a valid label ID",
        });
      }

      const label = await gmailService.getLabel(labelId);

      res.status(200).json({
        success: true,
        data: label,
        message: "Label retrieved successfully",
      });
    } catch (error) {
      console.error("Error in getLabelById controller:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve label",
      });
    }
  }

  async healthCheck(req, res) {
    res.status(200).json({
      success: true,
      message: "Gmail API service is running",
      timestamp: new Date().toISOString(),
    });
  }

  async testEndpoint(req, res) {
    res.status(200).json({
      success: true,
      message: "Test endpoint working",
      data: {
        server: "Express",
        cors: "Enabled",
        timestamp: new Date().toISOString()
      }
    });
  }
}

export default new GmailController();

import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// The scope for reading Gmail labels.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

class GmailService {
  constructor() {
    this.auth = null;
    this.gmail = null;
  }
  
  async authenticate() {
    if (!this.auth) {
      try {
        this.auth = await authenticate({
          scopes: SCOPES,
          keyfilePath: CREDENTIALS_PATH,
        });
        this.gmail = google.gmail({ version: "v1", auth: this.auth });
      } catch (error) {
        console.error("Authentication failed:", error);
        throw new Error(`Authentication failed: ${error.message}`);
      }
    }
    return this.gmail;
  }

  async listLabels() {
    try {
      const gmail = await this.authenticate();

      // Get the list of labels.
      const result = await gmail.users.labels.list({
        userId: "me",
      });

      const labels = result.data.labels;
      if (!labels || labels.length === 0) {
        return [];
      }

      return labels;
    } catch (error) {
      console.error("Error listing labels:", error);
      throw new Error(`Failed to list labels: ${error.message}`);
    }
  }

  async getLabel(labelId) {
    try {
      const gmail = await this.authenticate();

      const result = await gmail.users.labels.get({
        userId: "me",
        id: labelId,
      });

      return result.data;
    } catch (error) {
      console.error("Error getting label:", error);
      throw new Error(`Failed to get label: ${error.message}`);
    }
  }
}

export default new GmailService();

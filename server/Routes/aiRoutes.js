import express from "express";
import protect from "../Middlewares/authMiddleware.js";
import {
  deleteUserReport,
  enhanceJobDescription,
  enhanceProfessionalSummary,
  generateInterviewReport,
  generateResumePdf,
  
  getInterviewReport,
  getUserReports,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/interview-analysis", protect, generateInterviewReport);
aiRouter.get("/report/:id", protect, getInterviewReport);
aiRouter.get("/reports", protect, getUserReports );
aiRouter.delete("/deleteReport/:id", protect, deleteUserReport );
aiRouter.post("/generate-resume-pdf", protect, generateResumePdf);

export default aiRouter;

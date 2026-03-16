import express from "express";
import protect from "../Middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resemeRouter = express.Router();

resemeRouter.post("/create", protect, createResume);
resemeRouter.put("/update", upload.single("image"), protect, updateResume);
resemeRouter.delete("/delete/:resumeId", protect, deleteResume);
resemeRouter.get("/get/:resumeId", protect, getResumeById);
resemeRouter.get("/public/:resumeId",  getPublicResumeById);

export default resemeRouter

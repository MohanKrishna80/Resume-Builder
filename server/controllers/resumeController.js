// controller for creating new resume
//POST:/api/resumes/create

import imagekit from "../configs/Imagekit.js";
import Resume from "../Models/Resume.js";
import fs from "fs";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Comtroller for deleting a resume
//DELETE:/api/resumes/delete

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });

    return res.status(201).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message});
  }
};

//get user resume by id
//GET:/api/resumes/get

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedat = undefined;

    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get public resume by id
//GET:/api/resumes/public

export const getPublicResumeById = async (req, res) => {
  try {
    const {resumeId} = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for updatinga resume
//PUT:/api/resumes/update

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    let { resumeId, resumeData, removeBackground } = req.body;

    const image = req.file;
    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = await JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    if (image) {
     const imageBufferData = fs.createReadStream(image.path);
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeDataCopy.personal_info.image = response.url;
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true },
    );
    return res
      .status(201)
      .json({ message: "Saved Successfully", updatedResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};




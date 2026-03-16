//controllers/aiController.js

import ai from "../configs/ai.js";
import Resume from "../Models/Resume.js";
import aiReport from "../Models/aiReport.js";
import mongoose from "mongoose";
import { report } from "process";

import puppeteer from "puppeteer";

//----------------------------------------------------
// Enhance Professional Summary
// POST: /api/ai/enhance-pro-sum
//----------------------------------------------------

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Improve the user's professional summary into 1–2 concise sentences highlighting key skills, experience, and career goals. Make it ATS-friendly and compelling. Return only the improved summary text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//----------------------------------------------------
// Enhance Job Description
// POST: /api/ai/enhance-job-dec
//----------------------------------------------------

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only 1–2 sentences highlighting key responsibilities and achievements. Use strong action verbs and include quantifiable results where possible. Make it ATS-friendly. Return only the improved text without any options or explanations.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//----------------------------------------------------
// Upload Resume & Extract Data
// POST: /api/ai/upload-resume
//----------------------------------------------------

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI system that extracts structured information from resumes.";

    const userPrompt = `
Extract structured information from the resume text below.

Return ONLY valid JSON. Do not include explanations or extra text.

If a field is missing, return an empty string "" or empty array [].

Required JSON structure:

{
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },

  "professional_summary": "",

  "skills": [],

  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "is_current": false,
      "description": ""
    }
  ],

  "projects": [
    {
      "name": "",
      "type": "",
      "description": "",
      "live_link": ""
    }
  ],

  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

Resume text:
${resumeText}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content.trim();
    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({ userId, title, ...parsedData });

    return res.json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//----------------------------------------------------
// Generate AI Interview Report
// POST: /api/ai/interview-analysis
//----------------------------------------------------

export const generateInterviewReport = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const userId = req.userId;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "resumeText and jobDescription are required",
      });
    }

    const systemPrompt =
      "You are an expert technical interviewer and career coach.";

    const userPrompt = `
Analyze the candidate's resume and the job description.

Generate interview preparation insights.

Return ONLY valid JSON.

JSON format:

{
  "matchScore": { "overall": 0 },

  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": "Explain the recommended approach to answer the question, key concepts to mention, and the main takeaways the candidate should communicate."
    }
  ],

  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": "Explain the approach the candidate should take while answering, what story structure to follow (for example STAR method), and the main points to highlight."
    }
  ],

  "skillGaps": [
    {
      "skill": "",
      "severity": "low | medium | high"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": []
    }
  ]
}

Instructions:
- Match score should reflect how well the resume aligns with the job description.
- Technical questions should be relevant to the technologies in the job description.
- Behavioral questions should reflect real interview scenarios.
- The "answer" field should NOT contain a full answer, but instead explain:
  • the approach to answering  
  • key concepts to mention  
  • main takeaways the interviewer expects  

Resume:
${resumeText}

Job Description:
${jobDescription}
`;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const report = JSON.parse(response.choices[0].message.content);

    // 🔹 Save report in MongoDB
    const savedReport = await aiReport.create({
      userId,
      jobDescription,
      resume: resumeText,

      matchScore: report.matchScore.overall,
      technicalQuestions: report.technicalQuestions,
      behavioralQuestions: report.behavioralQuestions,
      skillGaps: report.skillGaps,
      preparationPlan: report.preparationPlan,
    });

    return res.status(200).json({
      report: savedReport,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const getInterviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const report = await aiReport.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const userId = req.userId;

    const reports = await aiReport.find({ userId: userId }).sort({
      createdAt: -1,
    });

    res.json({ reports });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await aiReport.findByIdAndDelete({ userId, _id: id });
    return res.status(201).json({ message: "Report deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//----------------------------------------------------
// Generate Resume pdf with the help of AI and Puppeteer
// POST: /api/ai/resume-pdf
//----------------------------------------------------

export const generateResumePdf = async (req, res) => {
  
 const generatePdfFromHtml = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdf;
};
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "resumeText and jobDescription are required",
      });
    }

    const systemPrompt =
      "You are an expert resume designer who creates clean ATS friendly HTML resumes.";

   const prompt = `
You are a professional resume writer and resume designer.

Your task is to generate a clean, professional, ATS-friendly resume tailored specifically to the provided job description.

Return ONLY valid JSON.

JSON format:
{
  "html": ""
}

--------------------------------------------------

CRITICAL REQUIREMENT

The resume MUST fit on **ONE PAGE ONLY** when converted to PDF.

To ensure this:

• Reduce unnecessary spacing.
• Use compact but readable layout.
• Use small margins and efficient section spacing.
• Keep bullet points concise.
• Limit content to the most relevant experience.
• Do NOT exceed one page.

If content is too long, prioritize the most relevant experience for the job description.

--------------------------------------------------

RESUME WRITING RULES

• Tailor the resume specifically to the job description.
• Highlight the candidate's most relevant skills, projects, and experience.
• Emphasize strengths that align with the job requirements.
• Prioritize technologies and responsibilities mentioned in the job description.

• If the job description mentions important skills that are not clearly present in the resume, intelligently integrate those skills where appropriate:
  - in the Skills section
  - in project descriptions
  - in experience bullet points

• Do NOT fabricate fake companies or roles.
• Only enhance existing information logically.

• Use concise, professional resume language.
• Avoid generic AI phrases.
• Write like a real human resume writer.

Example style:

"Built reusable React components improving UI performance by 30%."

Avoid phrases like:

"I am a passionate developer..."

--------------------------------------------------

RESUME STRUCTURE

The resume should contain these sections:

1. Header
   - Full Name
   - Role / Title
   - Email
   - Phone
   - Location
   - Links (GitHub / LinkedIn / Portfolio if available)

2. Professional Summary
   - 2–3 strong sentences highlighting the candidate's strengths relevant to the job.

3. Skills
   - Organized list of technical skills relevant to the job description.

4. Work Experience
   - Company
   - Role
   - Dates
   - 2–3 concise bullet points per role.

5. Projects
   - Project name
   - Short description
   - Technologies used
   - Live link if available
   - Key contribution

6. Education

--------------------------------------------------

HTML DESIGN RULES

• The output MUST be valid HTML with inline CSS.
• The layout must be optimized for A4 page size.
• The entire resume must fit within one page.

Spacing rules:

• Reduce padding and margins.
• Keep section spacing compact.
• Use bullet lists efficiently.

Use semantic HTML:

<header>
<section>
<h2>
<ul>

Design guidelines:

• Use clean sans-serif font.
• Use subtle accent colors for headings.
• Keep typography professional.
• Keep the design minimal and readable.

You may use subtle styling like:

• colored section headings
• divider lines
• bold role titles

But do NOT over-design.

--------------------------------------------------

IMPORTANT

• The resume must NOT look AI-generated.
• Writing must feel natural and professional.
• The resume must look like a real human-written resume.
• The HTML must render correctly when converted to PDF.
• The final resume MUST fit on ONE PAGE.

--------------------------------------------------

Candidate Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    // generate pdf
    const pdfBuffer = await generatePdfFromHtml(result.html);

    // send pdf
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    return res.send(pdfBuffer);

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


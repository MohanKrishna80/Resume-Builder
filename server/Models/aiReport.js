import mongoose from "mongoose";

const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    tasks: [
      {
        type: String,
        required: [true, "Task is required"],
      },
    ],
  },
  { _id: false }
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  { _id: false }
);

const aiReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    jobDescription: {
      type: String,
      required: true,
    },

    resume: {
      type: String,
    },

    selfDescription: {
      type: String,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    technicalQuestions: [technicalQuestionsSchema],

    behavioralQuestions: [behavioralQuestionsSchema],

    skillGaps: [skillGapsSchema],

    preparationPlan: [preparationPlanSchema],
  },
  {
    timestamps: true,
  }
);

const AiReport = mongoose.model("AiReport", aiReportSchema);

export default AiReport;
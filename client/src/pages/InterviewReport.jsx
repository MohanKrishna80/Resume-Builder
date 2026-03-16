import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../configs/api";
import { useSelector } from "react-redux";
import { ArrowLeftIcon, Loader2 } from "lucide-react";

const InterviewReport = () => {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("technical");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadReport = async () => {
      const { data } = await api.get("/api/ai/report/" + id, {
        headers: { Authorization: token },
      });

      setReport(data.report);
    };

    loadReport();
  }, [id, token]);

  if (!report)
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-slate-400 bg-slate-950">
        <Loader2 className="animate-spin" />
        Loading report...
      </div>
    );

  const questions =
    activeSection === "technical"
      ? report.technicalQuestions
      : report.behavioralQuestions;

  const generateResume = async () => {
    try {
      setIsGenerating(true);

      const response = await api.post(
        "/api/ai/generate-resume-pdf",
        {
          resumeText: report.resume,
          jobDescription: report.jobDescription,
        },
        {
          headers: { Authorization: token },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = "resume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getMatchInfo = (score) => {
    if (score >= 80)
      return {
        message: "Excellent match for this role",
        scoreColor: "text-green-500",
        textColor: "text-green-400",
      };

    if (score >= 60)
      return {
        message: "Strong match for this role",
        scoreColor: "text-green-400",
        textColor: "text-green-300",
      };

    if (score >= 40)
      return {
        message: "Moderate match – can be improved",
        scoreColor: "text-yellow-400",
        textColor: "text-yellow-300",
      };

    return {
      message: "Low match – consider improving your resume",
      scoreColor: "text-red-400",
      textColor: "text-red-300",
    };
  };

  const matchInfo = getMatchInfo(report.matchScore);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">

      {/* LEFT SIDEBAR */}
      <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900 p-4 lg:p-6">

        <p className="text-xs text-slate-400 uppercase mb-4">Sections</p>

        <div className="flex lg:block gap-2 overflow-x-auto">

          <button
            onClick={() => setActiveSection("technical")}
            className={`px-3 py-2 rounded text-sm whitespace-nowrap ${
              activeSection === "technical"
                ? "bg-pink-500/20 text-pink-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Technical
          </button>

          <button
            onClick={() => setActiveSection("behavioral")}
            className={`px-3 py-2 rounded text-sm whitespace-nowrap ${
              activeSection === "behavioral"
                ? "bg-pink-500/20 text-pink-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Behavioral
          </button>

          <button
            onClick={() => setActiveSection("roadmap")}
            className={`px-3 py-2 rounded text-sm whitespace-nowrap ${
              activeSection === "roadmap"
                ? "bg-pink-500/20 text-pink-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Roadmap
          </button>

        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">

        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-slate-900 border border-slate-700 text-slate-300 hover:bg-pink-500/20 transition mb-6"
        >
          <ArrowLeftIcon size={16} />
          Back
        </button>

        <div className="flex flex-wrap items-center gap-3 mb-6">

          <h2 className="text-lg md:text-xl font-semibold">
            {activeSection === "technical"
              ? "Technical Questions"
              : activeSection === "behavioral"
              ? "Behavioral Questions"
              : "Preparation Roadmap"}
          </h2>

          {activeSection !== "roadmap" && (
            <span className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-400">
              {questions?.length} questions
            </span>
          )}

        </div>

        {activeSection !== "roadmap" &&
          questions?.map((q, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-lg mb-3"
            >
              <div
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between items-center px-4 md:px-5 py-4 cursor-pointer"
              >

                <div className="flex gap-3 items-start">
                  <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded">
                    Q{i + 1}
                  </span>

                  <p className="text-sm">{q.question}</p>
                </div>

                <span className="text-slate-400">
                  {openIndex === i ? "-" : "+"}
                </span>

              </div>

              {openIndex === i && (
                <div className="px-5 pb-4 text-sm text-slate-300">
                  <p className="text-slate-400 mb-2">{q.intention}</p>
                  <p>{q.answer}</p>
                </div>
              )}
            </div>
          ))}

        {activeSection === "roadmap" && (
          <div className="space-y-4">
            {report.preparationPlan?.map((day, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5"
              >
                <p className="text-sm font-semibold text-pink-400">
                  Day {day.day}
                </p>

                <p className="text-white mt-1 font-medium">{day.focus}</p>

                <ul className="list-disc ml-6 mt-3 text-sm text-slate-300 space-y-1">
                  {day.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 p-6 space-y-6">

        <div className="text-center">

          <p className="text-xs uppercase text-slate-400">Match Score</p>

          <div className={`text-4xl font-bold mt-4 ${matchInfo.scoreColor}`}>
            {report.matchScore}%
          </div>

          <p className={`text-sm mt-2 ${matchInfo.textColor}`}>
            {matchInfo.message}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase text-slate-400 mb-4">
            Skill Gaps
          </p>

          <div className="flex flex-wrap gap-2">
            {report.skillGaps?.map((gap, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded text-sm bg-red-500/20 text-red-400"
              >
                {gap.skill}
              </div>
            ))}
          </div>

          <button
            onClick={generateResume}
            disabled={isGenerating}
            className="w-full bg-pink-600 hover:bg-pink-700 rounded-md py-2 mt-4 text-sm flex justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin size-4" />
                Generating...
              </>
            ) : (
              "Generate Resume with AI"
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default InterviewReport;
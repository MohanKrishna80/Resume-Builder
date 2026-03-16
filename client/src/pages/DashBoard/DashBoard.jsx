import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../configs/api";
import { toast } from "react-hot-toast";
import pdfToText from "react-pdftotext";

const DashBoard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalyzeResume, setShowAnalyzeResume] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [aiReports, setAiReports] = useState([]);

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        "/api/users/resumes",

        { headers: { Authorization: token } },
      );
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async (e) => {
    try {
      e.preventDefault();

      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } },
      );

      console.log(data);

      setAllResumes((prev) => [...prev, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } },
      );
      console.log(data);

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }

    setIsLoading(false);
  };
  const analyzeResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resumeText = await pdfToText(resume);

      const { data } = await api.post(
        "/api/ai/interview-analysis",
        {
          resumeText,
          jobDescription,
        },
        { headers: { Authorization: token } },
      );

      navigate(`/app/interview-report/${data.report._id}`);
      console.log(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }

    setIsLoading(false);
  };

  const editTitle = async (e) => {
    try {
      e.preventDefault();

      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: { title },
        },
        {
          headers: { Authorization: token },
        },
      );

      setAllResumes((prev) =>
        prev.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume,
        ),
      );

      setTitle("");
      setEditResumeId("");

      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume ?",
      );
      if (confirm) {
        const { data } = await api.delete(
          `/api/resumes/delete/${resumeId}`,

          { headers: { Authorization: token } },
        );
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const loadReports = async () => {
    try {
      const { data } = await api.get("/api/ai/reports", {
        headers: { Authorization: token },
      });
      console.log(data.reports);

      setAiReports(data.reports);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteReport = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this report ?",
      );
      if (confirm) {
        const { data } = await api.delete(
          `/api/ai/deleteReport/${id}`,

          { headers: { Authorization: token } },
        );
        setAiReports(aiReports.filter((report) => report._id !== id));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
    loadReports();
  }, []);
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Mohan
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowCreateResume(true);
            }}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col justify-center items-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full " />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
          <button
            onClick={() => {
              setShowUploadResume(true);
            }}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col justify-center items-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full " />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing Resume
            </p>
          </button>
          <button
            onClick={() => setShowAnalyzeResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col justify-center items-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <FilePenLineIcon className="size-11 p-2.5 bg-gradient-to-br from-blue-300 to-blue-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-blue-600 transition-all duration-300">
              Analyze Resume with AI
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-[305px]" />
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center gap-2 text-slate-500">
              <LoaderCircleIcon className="animate-spin size-6" />
              Loading resumes...
            </div>
          ) : (
            allResumes?.filter(Boolean).map((resume, index) => {
              const baseColor = colors[index % colors.length];

              return (
                <button
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  key={resume._id}
                  className="relative w-full sm:max-w-36 h-48 flex flex-col justify-center items-center rounded-lg gap-2 text-slate-600 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg,${baseColor}10,${baseColor}40)`,
                    borderColor: baseColor + "40",
                  }}
                >
                  <FilePenLineIcon
                    className="size-7 group-hover:scale-105 transition-all"
                    style={{ color: baseColor }}
                  />

                  <p
                    className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                    style={{ color: baseColor }}
                  >
                    {resume?.title}
                  </p>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 right-1 group-hover:flex items-center hidden"
                  >
                    <TrashIcon
                      onClick={() => deleteResume(resume._id)}
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />

                    <PencilIcon
                      onClick={() => {
                        setEditResumeId(resume._id);
                        setTitle(resume.title);
                      }}
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <hr className="border-slate-300 my-8" />

        <h2 className="text-xl font-semibold mb-4">AI Interview Reports</h2>

       <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
  {isLoading ? (
    <div className="flex justify-center items-center gap-2 text-slate-500">
      <LoaderCircleIcon className="animate-spin size-6" />
      Loading reports...
    </div>
  ) : (
    aiReports?.map((report, index) => {
      const baseColor = colors[index % colors.length];

      return (
        <button
          key={report._id}
          onClick={() => navigate(`/app/interview-report/${report._id}`)}
          className="relative w-full sm:max-w-36 h-48 flex flex-col justify-center items-center rounded-lg gap-2 text-slate-600 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
          style={{
            background: `linear-gradient(135deg,${baseColor}10,${baseColor}40)`,
            borderColor: baseColor + "40",
          }}
        >
          <FilePenLineIcon
            className="size-7 group-hover:scale-105 transition-all"
            style={{ color: baseColor }}
          />

          <p
            className="text-sm px-2 text-center group-hover:scale-105 transition-all"
            style={{ color: baseColor }}
          >
            Interview Report
          </p>

          <p
            className="text-[11px] text-slate-500"
            style={{ color: baseColor + "90" }}
          >
            {new Date(report.createdAt).toLocaleDateString()}
          </p>

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-1 right-1 group-hover:flex items-center hidden"
          >
            <TrashIcon
              onClick={() => deleteReport(report._id)}
              className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
            />
          </div>
        </button>
      );
    })
  )}
</div>
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => {
              setShowCreateResume(false);
            }}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

              <input
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 focus:ring-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <div
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <form
              onSubmit={uploadResume}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload a Resume</h2>

              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 focus:ring-green-600"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select resume file
                  <div className="flex flex-col items-center justify-center gap-2 border border-slate-400 border-dashed rounded-md p-4 py-10 my-4 text-slate-400 group hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>

                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "uploading..." : "Upload Resume"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </form>
          </div>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => {
              setEditResumeId("");
            }}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

              <input
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 focus:ring-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showAnalyzeResume && (
          <div
            onClick={() => setShowAnalyzeResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <form
              onSubmit={analyzeResume}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Analyze Resume for Job</h2>

              {/* Resume Upload */}
              <div>
                <label
                  htmlFor="analyze-resume-input"
                  className="block text-sm text-slate-700 cursor-pointer"
                >
                  Upload Resume
                  <div className="flex flex-col items-center justify-center gap-2 border border-slate-400 border-dashed rounded-md p-4 py-8 my-3 text-slate-400 group hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-12 stroke-1" />
                        <p>Select Resume</p>
                      </>
                    )}
                  </div>
                </label>

                <input
                  id="analyze-resume-input"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              {/* Job Description */}
              <textarea
                placeholder="Paste Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full border rounded p-3 mt-4 h-32 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              {/* Submit Button */}
              <button
                disabled={isLoading}
                className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "Analyzing..." : "Generate Report"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => setShowAnalyzeResume(false)}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;

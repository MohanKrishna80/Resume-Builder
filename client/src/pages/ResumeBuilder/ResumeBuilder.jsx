import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../../assets/assets";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfo from "../../components/Forms/PersonalInfo";
import ResumePreview from "../../components/ResumePreview";
import TemplateSelector from "../../components/TemplateSelector";
import ColorPIcker from "../../components/ColorPIcker";
import ProfessionalSummary from "../../components/Forms/ProfessionalSummary";
import Experiance from "../../components/Forms/Experiance";
import Education from "../../components/Forms/Education";
import Projects from "../../components/Forms/Projects";
import Skills from "../../components/Forms/Skills";
import { useSelector } from "react-redux";
import api from "../../configs/api";
import toast from "react-hot-toast";
import FontSelector from "../../components/FontSelector";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    font_family: "Inter, sans-serif",
    public: false,
  });

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/get/" + resumeId, {
        headers: { Authorization: token },
      });
      if (data.resume) {
        setResumeData(data.resume);
        console.log(data.resume?.projects);

        document.title = data.resume.title;
        console.log(data.resume);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Inter, sans-serif");

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume();
  }, []);

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );
      const { data } = await api.put("/api/resumes/update/", formData, {
        headers: { Authorization: token },
      });
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      console.error("error saving resume", error);
    }
  };

  const handleShare = async () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;
    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: "My Resume",
      });
    } else {
      alert("Sharing is not supported on this browser");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async (e) => {
    try {
      let updatedResumeData = structuredClone(resumeData);
      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);

      formData.append("resumeData", JSON.stringify(updatedResumeData));

      removeBackground && formData.append("removeBackground", "yes");

      typeof resumeData.personal_info.image === "object" &&
        formData.append("image", resumeData.personal_info.image);

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: {
          Authorization: token,
        },
      });

      setResumeData((prev) => ({
        ...prev,
        ...data.resume,
      }));

      toast.success(data.message);
    } catch (error) {
      console.error("error saving resume", error);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 ">
          {/* left panel foem */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2  ">
                  <TemplateSelector
                    selectedTemplate={resumeData?.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPIcker
                    selectedColor={resumeData?.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                  <FontSelector
                    selectedFont={resumeData?.font_family}
                    onChange={(font) =>
                      setResumeData((prev) => ({
                        ...prev,
                        font_family: font,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0),
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1),
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1
                        ? "opacity-50"
                        : ""
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* form content */}

              <div className="space-y-6">
                {/* Personal Information */}
                {activeSection.id === "personal" && (
                  <PersonalInfo
                    data={resumeData?.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {/* Professional summary */}
                {activeSection.id === "summary" && (
                  <ProfessionalSummary
                    data={resumeData?.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {/* Experience Details */}
                {activeSection.id === "experience" && (
                  <Experiance
                    data={resumeData?.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}
                {/* Education Details */}
                {activeSection.id === "education" && (
                  <Education
                    data={resumeData?.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}
                {/* Projects */}

                {activeSection.id === "projects" && (
                  <Projects
                    data={resumeData?.projects ?? []}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: data,
                      }))
                    }
                  />
                )}

                {/* Skills */}

                {activeSection.id === "skills" && (
                  <Skills
                    data={resumeData?.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>
              <button
                onClick={() => {
                  toast.promise(saveResume, { loading: "saving" });
                }}
                className="bg-gradient-to-br from-green-100 to-green-200 text-green-600 ring-1 ring-green-300 hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* right panal preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex justify-end items-center gap-2">
                {resumeData?.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" />
                    Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  {resumeData?.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}

                  {resumeData?.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 ring-green-300 rounded-lg hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Preview */}
            <ResumePreview
              data={resumeData}
              template={resumeData?.template}
              accentColor={resumeData?.accent_color}
              fontFamily={resumeData?.font_family}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

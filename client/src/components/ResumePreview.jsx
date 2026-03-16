import React from "react";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import MinimalImageTemplate from "../components/templates/MinimalImageTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import TwoColumnTemplate from "./templates/Two-ColumnTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";
import ATSOptimizedTemplate from "./templates/AtsTemplate";
import DeveloperTemplate from "./templates/DeveloperTemplate";

const ResumePreview = ({ data, template, accentColor,fontFamily, classes = "" }) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "two-column":
        return <TwoColumnTemplate data={data} accentColor={accentColor} />;
      case "timeline":
        return <TimelineTemplate data={data} accentColor={accentColor} />;
      case "ats-optimized":
        return <ATSOptimizedTemplate data={data} accentColor={accentColor} />;
      case "developer":
        return <DeveloperTemplate data={data} accentColor={accentColor} />;

      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };
  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none " +
          classes
        }
        style={{ fontFamily: fontFamily || "Inter, sans-serif" }}
      >
        {renderTemplate()}
      </div>
      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }

          @media print {
            html,
            body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
            }

            body * {
              visibility: hidden;
            }

            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }

            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;

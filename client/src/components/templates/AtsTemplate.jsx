import { Mail, Phone, MapPin } from "lucide-react";

const ATSOptimizedTemplate = ({ data }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-black">

      {/* Header */}
      <h1 className="text-2xl font-bold">
        {data.personal_info?.full_name}
      </h1>

      <p className="text-sm">
        {data.personal_info?.email} | {data.personal_info?.phone} | {data.personal_info?.location}
      </p>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mt-6">
          <h2 className="font-bold">SUMMARY</h2>
          <p className="text-sm">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold">EXPERIENCE</h2>

          {data.experience.map((exp, index) => (
            <div key={index} className="mt-2">

              <strong>{exp.position}</strong> - {exp.company}

              <div className="text-xs">
                {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
              </div>

              {exp.description && (
                <p className="text-sm whitespace-pre-line">
                  {exp.description}
                </p>
              )}

            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
  <section className="mt-6">
    <h2 className="font-bold">PROJECTS</h2>

    {data.projects.map((project, index) => (
      <div key={index} className="mt-2">

        <div className="flex justify-between">

          <strong>{project.name}</strong>

          <div className="flex gap-3 text-sm">
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Link
              </a>
            )}

            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitHub
              </a>
            )}
          </div>

        </div>

        {project.type && (
          <p className="text-xs">{project.type}</p>
        )}

        {project.description && (
          <p className="text-sm whitespace-pre-line">
            {project.description}
          </p>
        )}

      </div>
    ))}
  </section>
)}

      {/* Education */}
      {data.education?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold">EDUCATION</h2>

          {data.education.map((edu, index) => (
            <div key={index} className="mt-2">

              <strong>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </strong>

              <div className="text-xs">
                {edu.institution} | {formatDate(edu.graduation_date)}
              </div>

              {edu.gpa && (
                <div className="text-xs">
                  GPA: {edu.gpa}
                </div>
              )}

            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold">SKILLS</h2>
          <p>{data.skills.join(", ")}</p>
        </section>
      )}

    </div>
  );
};

export default ATSOptimizedTemplate;
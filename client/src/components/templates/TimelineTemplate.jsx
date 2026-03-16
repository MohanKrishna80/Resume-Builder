import { Mail, Phone, MapPin } from "lucide-react";

const TimelineTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-zinc-800 p-8">

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold">
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex gap-4 text-sm text-zinc-600 mt-2">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} />
              {data.personal_info.email}
            </div>
          )}

          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} />
              {data.personal_info.phone}
            </div>
          )}

          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {data.personal_info.location}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mb-10">
          <h2
            className="text-sm font-semibold tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            SUMMARY
          </h2>

          <p className="text-sm text-zinc-700 leading-relaxed">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience Timeline */}
      {data.experience?.length > 0 && (
        <section className="mb-10">

          <h2
            className="text-sm font-semibold tracking-widest mb-6"
            style={{ color: accentColor }}
          >
            EXPERIENCE
          </h2>

          <div className="border-l pl-6 space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>

                <div className="flex justify-between">
                  <h3 className="font-semibold">{exp.position}</h3>

                  <span className="text-xs text-zinc-500">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>

                <p className="text-sm" style={{ color: accentColor }}>
                  {exp.company}
                </p>

                {exp.description && (
                  <p className="text-sm whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>

        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-10">

          <h2
            className="text-sm font-semibold tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            PROJECTS
          </h2>

          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index}>

                <div className="flex justify-between">

                  <h3 className="font-semibold">{project.name}</h3>

                  <div className="flex gap-3 text-sm">
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Link
                      </a>
                    )}

                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>

                </div>

                {project.description && (
                  <p className="text-sm">{project.description}</p>
                )}
              </div>
            ))}
          </div>

        </section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <section className="mb-10">

          <h2
            className="text-sm font-semibold tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            EDUCATION
          </h2>

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>

                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>

                  <span className="text-xs text-zinc-500">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>

                <p className="text-sm text-zinc-600">{edu.institution}</p>

                {edu.gpa && (
                  <p className="text-xs text-zinc-500">
                    GPA: {edu.gpa}
                  </p>
                )}

              </div>
            ))}
          </div>

        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>

          <h2
            className="text-sm font-semibold tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            SKILLS
          </h2>

          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: accentColor }}
              >
                {skill}
              </span>
            ))}
          </div>

        </section>
      )}

    </div>
  );
};

export default TimelineTemplate;
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const TwoColumnTemplate = ({ data, accentColor }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short"
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white text-gray-800">
      <div className="grid grid-cols-3">

       
        <aside className="col-span-1 p-6 border-r border-gray-200">

          
          <h1 className="text-2xl font-bold mb-6" style={{ color: accentColor }}>
            {data.personal_info?.full_name || "Your Name"}
          </h1>

          
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase mb-3 text-gray-600">
              Contact
            </h2>

            <div className="space-y-2 text-sm">
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} style={{ color: accentColor }} />
                  <span className="break-all">{data.personal_info.email}</span>
                </div>
              )}

              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}

              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: accentColor }} />
                  <span >{data.personal_info.location}</span>
                </div>
              )}

              {data.personal_info?.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={14} style={{ color: accentColor }} />
                  <span className="break-all">
                    {data.personal_info.linkedin}
                  </span>
                </div>
              )}

              {data.personal_info?.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} style={{ color: accentColor }} />
                  <span className="break-all">
                    {data.personal_info.website}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase mb-3 text-gray-600">
                Skills
              </h2>

              <ul className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="col-span-2 p-8">

          {/* Summary */}
          {data.professional_summary && (
            <section className="mb-8">
              <h2
                className="text-lg font-semibold mb-3"
                style={{ color: accentColor }}
              >
                Professional Summary
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-8">

              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: accentColor }}
              >
                Experience
              </h2>

              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index}>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{exp.position}</h3>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                      </div>

                      <span className="text-sm text-gray-500">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>

                    {exp.description && (
                      <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-8">

              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: accentColor }}
              >
                Projects
              </h2>

              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>

                    <div className="flex justify-between items-center">

                      <h3 className="font-semibold">
                        {proj.name}
                      </h3>

                      <div className="flex gap-3 text-sm">
                        {proj.live_link && (
                          <a
                            href={proj.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: accentColor }}
                          >
                            Live
                          </a>
                        )}

                        {proj.github_link && (
                          <a
                            href={proj.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: accentColor }}
                          >
                            GitHub
                          </a>
                        )}
                      </div>

                    </div>

                    {proj.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {proj.description}
                      </p>
                    )}

                  </div>
                ))}
              </div>

            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>

              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: accentColor }}
              >
                Education
              </h2>

              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between">

                    <div>
                      <h3 className="font-semibold">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {edu.institution}
                      </p>
                    </div>

                    <span className="text-sm text-gray-500">
                      {formatDate(edu.graduation_date)}
                    </span>

                  </div>
                ))}
              </div>

            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default TwoColumnTemplate;
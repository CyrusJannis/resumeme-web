"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ResumeEditorProps {
  resumeId?: string;
}

const DEFAULT_RESUME_CONTENT = {
  personalInfo: {
    fullName: "Your Name",
    email: "your.email@example.com",
    phone: "+1 (555) 000-0000",
    location: "City, State",
    summary: "Professional summary here",
  },
  experience: [
    {
      id: "1",
      position: "Job Title",
      company: "Company Name",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Key accomplishments and responsibilities",
    },
  ],
  education: [
    {
      id: "1",
      school: "University Name",
      degree: "Degree Name",
      field: "Field of Study",
      graduationDate: "2020-05",
    },
  ],
  skills: ["Skill 1", "Skill 2", "Skill 3"],
};

export function ResumeEditor({ resumeId }: ResumeEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState(DEFAULT_RESUME_CONTENT);
  const [title, setTitle] = useState("My Resume");
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  const loadResume = async () => {
    try {
      const response = await fetch(`/api/resumes?id=${resumeId}`);
      if (response.ok) {
        const resume = await response.json();
        setTitle(resume.title);
        setContent(resume.content);
      }
    } catch (error) {
      console.error("Failed to load resume:", error);
    }
  };

  const saveResume = async () => {
    if (!session?.user?.id) {
      alert("Please log in to save");
      return;
    }

    setIsSaving(true);
    try {
      const method = resumeId ? "PUT" : "POST";
      const endpoint = resumeId ? `/api/resumes?id=${resumeId}` : "/api/resumes";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const saved = await response.json();
        alert("Resume saved successfully!");
        if (!resumeId) {
          router.push(`/editor/${saved.id}`);
        }
      } else {
        alert("Failed to save resume");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving resume");
    } finally {
      setIsSaving(false);
    }
  };

  const requestAiOptimization = async (section: string) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: resumeId || "new",
          action: "optimize",
          section,
          content: JSON.stringify(content),
        }),
      });

      if (response.ok) {
        const { response: aiResponse } = await response.json();
        alert("AI Suggestions:\n\n" + aiResponse);
      } else {
        alert("AI feature requires Pro plan");
      }
    } catch (error) {
      console.error("AI error:", error);
      alert("Error getting AI suggestions");
    } finally {
      setAiLoading(false);
    }
  };

  const exportPdf = async () => {
    if (!resumeId) {
      alert("Save resume first");
      return;
    }

    try {
      const response = await fetch("/api/resumes/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });

      if (response.ok) {
        const { pdfUrl } = await response.json();
        window.open(pdfUrl, "_blank");
      } else {
        alert("PDF export requires Pro plan");
      }
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume Title"
              className="text-4xl font-bold text-white bg-transparent border-b-2 border-blue-500 focus:outline-none mb-2 w-full"
            />
            <p className="text-slate-400">Version auto-saved</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveResume}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={exportPdf}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Edit Panel */}
          <div className="space-y-8">
            {/* Personal Info Section */}
            <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
              <h2 className="text-2xl font-bold text-white mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={content.personalInfo.fullName}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      personalInfo: {
                        ...content.personalInfo,
                        fullName: e.target.value,
                      },
                    })
                  }
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      personalInfo: {
                        ...content.personalInfo,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  value={content.personalInfo.summary}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      personalInfo: {
                        ...content.personalInfo,
                        summary: e.target.value,
                      },
                    })
                  }
                  placeholder="Professional Summary"
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none h-24"
                />
                <button
                  onClick={() => requestAiOptimization("summary")}
                  disabled={aiLoading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {aiLoading ? "Getting suggestions..." : "✨ AI Optimize"}
                </button>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-slate-700/50 backdrop-blur p-6 rounded-xl border border-slate-600">
              <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
              <div className="space-y-2">
                {content.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...content.skills];
                        newSkills[idx] = e.target.value;
                        setContent({ ...content, skills: newSkills });
                      }}
                      className="flex-1 px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        setContent({
                          ...content,
                          skills: content.skills.filter((_, i) => i !== idx),
                        });
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      skills: [...content.skills, "New Skill"],
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500"
                >
                  + Add Skill
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl sticky top-8 h-fit">
            <h1 className="text-4xl font-bold mb-2">
              {content.personalInfo.fullName}
            </h1>
            <p className="text-slate-600 text-sm mb-4">
              {content.personalInfo.email} • {content.personalInfo.phone}
            </p>
            <p className="text-slate-700 mb-6">{content.personalInfo.summary}</p>

            <h2 className="text-xl font-bold mt-6 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {content.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-8">
              Live preview • Auto-saves
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/editor/ResumeEditor.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/context';

interface ResumeContent {
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
}

export default function ResumeEditor({ resumeId }: { resumeId?: string }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('My Resume');
  const [content, setContent] = useState<ResumeContent>({
    summary: '',
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', field: '', year: '' }],
    skills: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      if (resumeId) {
        // Update existing resume
        await supabase
          .from('resumes')
          .update({
            title,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', resumeId)
          .eq('user_id', user.id);
      } else {
        // Create new resume
        await supabase.from('resumes').insert({
          user_id: user.id,
          title,
          content,
          is_draft: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold text-white bg-transparent border-none outline-none"
            placeholder="Resume Title"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Resume'}
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Professional Summary</h2>
            <textarea
              value={content.summary}
              onChange={(e) =>
                setContent({ ...content, summary: e.target.value })
              }
              className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Write a brief summary of your professional background..."
            />
          </div>

          {/* Experience */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Experience</h2>
            <div className="space-y-4">
              {content.experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-900 rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...content.experience];
                      newExp[idx].company = e.target.value;
                      setContent({ ...content, experience: newExp });
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => {
                      const newExp = [...content.experience];
                      newExp[idx].position = e.target.value;
                      setContent({ ...content, experience: newExp });
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    placeholder="Job Title"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...content.experience];
                        newExp[idx].startDate = e.target.value;
                        setContent({ ...content, experience: newExp });
                      }}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExp = [...content.experience];
                        newExp[idx].endDate = e.target.value;
                        setContent({ ...content, experience: newExp });
                      }}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...content.experience];
                      newExp[idx].description = e.target.value;
                      setContent({ ...content, experience: newExp });
                    }}
                    className="w-full h-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Description of responsibilities and achievements..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
            <input
              type="text"
              value={content.skills.join(', ')}
              onChange={(e) =>
                setContent({
                  ...content,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              placeholder="JavaScript, React, TypeScript, etc. (separated by commas)"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white text-slate-900 rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>

          {content.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Professional Summary</h2>
              <p className="text-slate-700 whitespace-pre-wrap">{content.summary}</p>
            </div>
          )}

          {content.experience.some((e) => e.company) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Experience</h2>
              {content.experience
                .filter((e) => e.company)
                .map((exp, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                        <p className="text-slate-700">{exp.company}</p>
                      </div>
                      <span className="text-sm text-slate-600">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-slate-700 mt-2 whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}

          {content.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {content.skills.map(
                  (skill) =>
                    skill && (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

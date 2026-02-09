"use client";

import { ResumeEditor } from "@/components/ResumeEditor";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const params = useParams();
  const resumeId = params.id as string;

  return <ResumeEditor resumeId={resumeId} />;
}

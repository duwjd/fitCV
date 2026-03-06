import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeUploadForm } from "@/components/resumes/resume-upload-form";

export const metadata: Metadata = {
  title: "새 이력서",
};

export default function NewResumePage() {
  return (
    <div>
      <PageHeader
        title="새 이력서 만들기"
        description="CV를 업로드하면 AI가 분석하여 최적화된 이력서를 만들어드립니다"
      />
      <ResumeUploadForm />
    </div>
  );
}

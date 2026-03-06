import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";
import { getResumes } from "@/actions/resume";
import { ResumeCard } from "@/components/resumes/resume-card";

export const metadata: Metadata = {
  title: "이력서",
};

export default async function ResumesPage() {
  const resumes = await getResumes();

  return (
    <div>
      <PageHeader title="이력서" description="AI로 생성한 이력서를 관리하세요">
        <Button asChild>
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" />
            새 이력서
          </Link>
        </Button>
      </PageHeader>

      {resumes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="이력서가 없습니다"
          description="CV를 업로드하면 AI가 최적화된 이력서를 만들어드려요."
          actionLabel="새 이력서 만들기"
          actionHref="/resumes/new"
        />
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Pencil, Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { getResumeById } from "@/actions/resume";
import { ResumePreview } from "@/components/resumes/resume-preview";
import { GenerateButton } from "./generate-button";
import type { ResumeContent } from "@/types/resume";

export const metadata: Metadata = {
  title: "이력서 상세",
};

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResumeById(id);
  if (!resume) notFound();

  const parsedData = resume.parsedData as unknown as ResumeContent | null;
  const generatedContent = resume.generatedContent as unknown as ResumeContent | null;
  const displayContent = generatedContent || parsedData;

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/resumes">
            <ArrowLeft className="mr-1 h-4 w-4" />
            이력서 목록
          </Link>
        </Button>
      </div>

      <PageHeader title={resume.title} description={resume.originalFileName || ""}>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/resumes/${id}/versions`}>
              <History className="mr-1 h-4 w-4" />
              버전 기록
            </Link>
          </Button>
          {parsedData && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/resumes/${id}/edit`}>
                <Pencil className="mr-1 h-4 w-4" />
                편집
              </Link>
            </Button>
          )}
          {parsedData && resume.status !== "GENERATING" && (
            <GenerateButton resumeId={id} />
          )}
        </div>
      </PageHeader>

      <div className="mb-4">
        <Badge
          variant={
            resume.status === "COMPLETED"
              ? "default"
              : resume.status === "ERROR"
                ? "destructive"
                : "secondary"
          }
        >
          {resume.status === "DRAFT" && "초안"}
          {resume.status === "PARSING" && "분석 중"}
          {resume.status === "PARSED" && "분석 완료"}
          {resume.status === "GENERATING" && "AI 생성 중"}
          {resume.status === "COMPLETED" && "완료"}
          {resume.status === "ERROR" && "오류"}
        </Badge>
      </div>

      {displayContent ? (
        <ResumePreview content={displayContent} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <Sparkles className="mb-4 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {resume.status === "PARSING"
              ? "AI가 이력서를 분석하고 있습니다..."
              : "아직 내용이 없습니다"}
          </p>
        </div>
      )}
    </div>
  );
}

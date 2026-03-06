import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResumeById } from "@/actions/resume";
import { ResumeEditor } from "./resume-editor";
import type { ResumeContent } from "@/types/resume";

export const metadata: Metadata = {
  title: "이력서 편집",
};

export default async function ResumeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResumeById(id);
  if (!resume) notFound();

  const content = (resume.parsedData as unknown as ResumeContent) || null;

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/resumes/${id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            돌아가기
          </Link>
        </Button>
      </div>

      {content ? (
        <ResumeEditor resumeId={id} initialContent={content} />
      ) : (
        <p className="text-sm text-muted-foreground">편집할 내용이 없습니다.</p>
      )}
    </div>
  );
}

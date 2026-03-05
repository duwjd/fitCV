import type { Metadata } from "next";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "이력서",
};

export default function ResumesPage() {
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
      <EmptyState
        icon={FileText}
        title="이력서가 없습니다"
        description="CV를 업로드하면 AI가 최적화된 이력서를 만들어드려요."
        actionLabel="새 이력서 만들기"
        actionHref="/resumes/new"
      />
    </div>
  );
}

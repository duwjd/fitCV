import type { Metadata } from "next";
import { PenTool, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "자기소개서",
};

export default function CoverLettersPage() {
  return (
    <div>
      <PageHeader
        title="자기소개서"
        description="채용공고에 맞춘 AI 자기소개서를 관리하세요"
      >
        <Button asChild>
          <Link href="/cover-letters/new">
            <Plus className="mr-2 h-4 w-4" />
            새 자기소개서
          </Link>
        </Button>
      </PageHeader>
      <EmptyState
        icon={PenTool}
        title="자기소개서가 없습니다"
        description="채용공고를 선택하면 AI가 맞춤 자기소개서를 작성해드려요."
        actionLabel="새 자기소개서 작성"
        actionHref="/cover-letters/new"
      />
    </div>
  );
}

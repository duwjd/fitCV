import type { Metadata } from "next";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "모의면접",
};

export default function InterviewsPage() {
  return (
    <div>
      <PageHeader
        title="모의면접"
        description="AI와 함께 면접을 연습하세요"
      >
        <Button asChild>
          <Link href="/interviews/new">
            <Plus className="mr-2 h-4 w-4" />
            새 면접 시작
          </Link>
        </Button>
      </PageHeader>
      <EmptyState
        icon={MessageSquare}
        title="면접 기록이 없습니다"
        description="AI 모의면접으로 실전 감각을 키워보세요."
        actionLabel="모의면접 시작하기"
        actionHref="/interviews/new"
      />
    </div>
  );
}

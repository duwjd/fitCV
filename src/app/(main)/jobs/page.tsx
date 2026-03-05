import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "채용공고",
};

export default function JobsPage() {
  return (
    <div>
      <PageHeader
        title="채용공고"
        description="진행 중인 채용 공고를 확인하세요"
      />
      <EmptyState
        icon={Briefcase}
        title="등록된 채용공고가 없습니다"
        description="곧 다양한 채용공고가 업데이트될 예정이에요."
      />
    </div>
  );
}

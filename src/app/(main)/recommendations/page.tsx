import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "추천",
};

export default function RecommendationsPage() {
  return (
    <div>
      <PageHeader
        title="맞춤 추천"
        description="AI가 분석한 나에게 맞는 채용공고"
      />
      <EmptyState
        icon={Sparkles}
        title="추천 공고가 없습니다"
        description="프로필과 이력서를 완성하면 맞춤 채용공고를 추천받을 수 있어요."
        actionLabel="프로필 완성하기"
        actionHref="/profile"
      />
    </div>
  );
}

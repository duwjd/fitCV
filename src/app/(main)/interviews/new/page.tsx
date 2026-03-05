import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "새 모의면접",
};

export default function NewInterviewPage() {
  return (
    <div>
      <PageHeader
        title="모의면접 시작"
        description="직무와 면접 유형을 선택하고 AI 면접관과 연습하세요"
      />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>면접 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            채용공고를 먼저 등록하면 더 정확한 면접 연습이 가능해요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

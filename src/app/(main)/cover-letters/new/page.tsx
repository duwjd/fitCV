import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "새 자기소개서",
};

export default function NewCoverLetterPage() {
  return (
    <div>
      <PageHeader
        title="새 자기소개서 작성"
        description="채용공고와 이력서를 선택하면 AI가 맞춤 자기소개서를 작성합니다"
      />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>자기소개서 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            채용공고와 이력서를 먼저 등록해주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

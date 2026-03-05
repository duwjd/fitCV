import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export const metadata: Metadata = {
  title: "새 이력서",
};

export default function NewResumePage() {
  return (
    <div>
      <PageHeader
        title="새 이력서 만들기"
        description="CV를 업로드하면 AI가 분석하여 최적화된 이력서를 만들어드립니다"
      />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>CV 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm font-medium">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX (최대 10MB)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "설정",
};

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="설정"
        description="계정 및 알림 설정을 관리하세요"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">계정</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              소셜 로그인으로 연결된 계정 정보입니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">알림 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              알림 설정은 준비 중입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

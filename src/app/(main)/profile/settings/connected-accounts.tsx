"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  naver: "네이버",
  kakao: "카카오",
};

interface Props {
  accounts: { provider: string }[];
}

export function ConnectedAccounts({ accounts }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">연결된 계정</CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.provider}
                className="flex items-center justify-between"
              >
                <span className="text-sm">
                  {PROVIDER_LABELS[account.provider] || account.provider}
                </span>
                <Badge variant="outline">연결됨</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            연결된 소셜 계정이 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

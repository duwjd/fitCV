"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateSettings } from "@/actions/settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  settings: {
    emailNotifications: boolean;
    deadlineReminders: boolean;
    jobRecommendations: boolean;
    interviewReminders: boolean;
  };
}

const NOTIFICATION_OPTIONS = [
  {
    key: "emailNotifications" as const,
    label: "이메일 알림",
    description: "주요 알림을 이메일로 받습니다",
  },
  {
    key: "deadlineReminders" as const,
    label: "마감일 알림",
    description: "지원 마감일 전 알림을 받습니다",
  },
  {
    key: "jobRecommendations" as const,
    label: "채용 추천",
    description: "맞춤 채용공고 추천 알림을 받습니다",
  },
  {
    key: "interviewReminders" as const,
    label: "면접 알림",
    description: "면접 일정 알림을 받습니다",
  },
];

export function NotificationSettings({ settings }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(key: string, value: boolean) {
    startTransition(async () => {
      const result = await updateSettings({ [key]: value });
      if (result.success) {
        toast.success("설정이 저장되었습니다");
      } else {
        toast.error("설정 변경에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">알림 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {NOTIFICATION_OPTIONS.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between"
          >
            <div>
              <Label>{option.label}</Label>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Switch
              checked={settings[option.key]}
              onCheckedChange={(checked) => handleToggle(option.key, checked)}
              disabled={isPending}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateSettings } from "@/actions/settings";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  theme: string;
}

export function ThemeSettings({ theme: initialTheme }: Props) {
  const { setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    setTheme(value);
    startTransition(async () => {
      const result = await updateSettings({ theme: value });
      if (result.success) {
        toast.success("테마가 변경되었습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">화면 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Label>테마</Label>
            <p className="text-xs text-muted-foreground">
              화면 테마를 선택합니다
            </p>
          </div>
          <Select
            defaultValue={initialTheme}
            onValueChange={handleChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">시스템</SelectItem>
              <SelectItem value="light">라이트</SelectItem>
              <SelectItem value="dark">다크</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

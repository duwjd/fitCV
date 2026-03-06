"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { changePassword } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다");
      return;
    }
    startTransition(async () => {
      const result = await changePassword({
        currentPassword,
        newPassword,
      });
      if (result.success) {
        toast.success("비밀번호가 변경되었습니다");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(result.error || "변경에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">비밀번호 변경</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호 (소셜 로그인 사용자는 비워두세요)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8자 이상, 영문 + 숫자"
            />
          </div>
          <Button type="submit" disabled={isPending || !newPassword}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            비밀번호 변경
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

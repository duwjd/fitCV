"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addSkill, removeSkill } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
  EXPERT: "전문가",
};

interface ProfileSkill {
  id: string;
  level: string;
  skill: {
    id: string;
    name: string;
  };
}

interface Props {
  skills: ProfileSkill[];
}

export function SkillSection({ skills }: Props) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("INTERMEDIATE");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await addSkill(name.trim(), level);
      if (result.success) {
        toast.success("스킬이 추가되었습니다");
        setName("");
      } else {
        toast.error(result.error || "추가에 실패했습니다");
      }
    });
  }

  function handleRemove(profileSkillId: string) {
    startTransition(async () => {
      const result = await removeSkill(profileSkillId);
      if (result.success) {
        toast.success("스킬이 삭제되었습니다");
      } else {
        toast.error(result.error || "삭제에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>스킬</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add skill */}
        <div className="flex gap-2">
          <Input
            placeholder="스킬명 (예: React, Python)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="flex-1"
          />
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={isPending || !name.trim()}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Skill list */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((ps) => (
              <Badge
                key={ps.id}
                variant="secondary"
                className="gap-1 py-1 pl-3 pr-1"
              >
                {ps.skill.name}
                <span className="text-muted-foreground">
                  · {LEVEL_LABELS[ps.level]}
                </span>
                <button
                  onClick={() => handleRemove(ps.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            보유 스킬을 추가해주세요. Enter 키로 빠르게 추가할 수 있습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

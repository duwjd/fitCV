"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleCareerGoal } from "@/actions/dashboard";

interface CareerGoal {
  id: string;
  title: string;
  isCompleted: boolean;
  targetDate: Date | null;
}

export function CareerGoalsWidget({ goals }: { goals: CareerGoal[] }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(goalId: string) {
    startTransition(async () => {
      const result = await toggleCareerGoal(goalId);
      if (!result.success) {
        toast.error(result.error || "변경에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">커리어 목표</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3">
                <Checkbox
                  checked={goal.isCompleted}
                  onCheckedChange={() => handleToggle(goal.id)}
                  disabled={isPending}
                />
                <div className="flex-1">
                  <span
                    className={`text-sm ${goal.isCompleted ? "text-muted-foreground line-through" : ""}`}
                  >
                    {goal.title}
                  </span>
                  {goal.targetDate && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ~{" "}
                      {new Date(goal.targetDate).toLocaleDateString("ko-KR")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <Target className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              커리어 목표를 설정해보세요
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

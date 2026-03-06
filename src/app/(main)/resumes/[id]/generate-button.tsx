"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateResume } from "@/actions/resume";

export function GenerateButton({ resumeId }: { resumeId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateResume(resumeId);
      if (result.success) {
        toast.success("AI 이력서가 생성되었습니다");
      } else {
        toast.error(result.error || "생성에 실패했습니다");
      }
    });
  }

  return (
    <Button size="sm" onClick={handleGenerate} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-1 h-4 w-4" />
      )}
      AI 최적화
    </Button>
  );
}

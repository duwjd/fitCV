"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { FileText, Star, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteResume, setDefaultResume } from "@/actions/resume";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "초안", variant: "secondary" },
  PARSING: { label: "분석 중", variant: "outline" },
  PARSED: { label: "분석 완료", variant: "default" },
  GENERATING: { label: "생성 중", variant: "outline" },
  COMPLETED: { label: "완료", variant: "default" },
  ERROR: { label: "오류", variant: "destructive" },
};

interface Props {
  resume: {
    id: string;
    title: string;
    status: string;
    isDefault: boolean;
    originalFileName: string | null;
    updatedAt: Date;
  };
}

export function ResumeCard({ resume }: Props) {
  const [isPending, startTransition] = useTransition();
  const status = STATUS_MAP[resume.status] ?? STATUS_MAP.DRAFT;

  function handleDelete() {
    if (!confirm("이력서를 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const result = await deleteResume(resume.id);
      if (result.success) {
        toast.success("삭제되었습니다");
      } else {
        toast.error(result.error || "삭제에 실패했습니다");
      }
    });
  }

  function handleSetDefault() {
    startTransition(async () => {
      const result = await setDefaultResume(resume.id);
      if (result.success) {
        toast.success("기본 이력서로 설정되었습니다");
      } else {
        toast.error(result.error || "설정에 실패했습니다");
      }
    });
  }

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <Link href={`/resumes/${resume.id}`} className="flex-1">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium">
                    {resume.title}
                  </h3>
                  {resume.isDefault && (
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                {resume.originalFileName && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {resume.originalFileName}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(resume.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                disabled={isPending}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!resume.isDefault && (
                <DropdownMenuItem onClick={handleSetDefault}>
                  <Star className="mr-2 h-4 w-4" />
                  기본 이력서로 설정
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

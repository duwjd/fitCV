"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { restoreVersion } from "@/actions/resume";

interface Version {
  id: string;
  version: number;
  changeNote: string | null;
  createdAt: Date;
}

interface Props {
  resumeId: string;
  versions: Version[];
}

export function VersionList({ resumeId, versions }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleRestore(versionId: string) {
    startTransition(async () => {
      const result = await restoreVersion(resumeId, versionId);
      if (result.success) {
        toast.success("버전이 복원되었습니다");
      } else {
        toast.error(result.error || "복원에 실패했습니다");
      }
    });
  }

  return (
    <div className="space-y-3">
      {versions.map((version, i) => (
        <div
          key={version.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <Badge variant={i === 0 ? "default" : "secondary"}>
              v{version.version}
            </Badge>
            <div>
              <p className="text-sm font-medium">
                {version.changeNote || `버전 ${version.version}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(version.createdAt).toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
          {i !== 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestore(version.id)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <RotateCcw className="mr-1 h-3 w-3" />
              )}
              복원
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

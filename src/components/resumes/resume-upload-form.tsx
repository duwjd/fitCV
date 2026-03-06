"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadAndParseResume } from "@/actions/resume";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function ResumeUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  function handleFile(selectedFile: File) {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error("PDF 또는 DOCX 파일만 업로드 가능합니다");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("파일 크기는 10MB 이하여야 합니다");
      return;
    }
    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.(pdf|docx?)$/i, ""));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }

  function handleSubmit() {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);

      const result = await uploadAndParseResume(formData);
      if (result.success) {
        toast.success("이력서가 분석되었습니다");
        router.push(`/resumes/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>CV 업로드</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">이력서 제목</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 프론트엔드 개발자 이력서"
            className="mt-1.5"
          />
        </div>

        {!file ? (
          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="mb-4 rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm font-medium">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX (최대 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleFile(selected);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFile(null)}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!file || isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI가 이력서를 분석하고 있습니다...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              업로드 및 분석
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

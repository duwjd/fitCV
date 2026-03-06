"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  certificationSchema,
  type CertificationInput,
} from "@/lib/validations/profile";
import {
  addCertification,
  updateCertification,
  deleteCertification,
} from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  credentialId: string | null;
}

interface Props {
  certifications: Certification[];
}

export function CertificationSection({ certifications }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>자격증</CardTitle>
        {!adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="mr-1 h-4 w-4" /> 추가
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {adding && <CertForm onClose={() => setAdding(false)} />}

        {certifications.map((cert) =>
          editing === cert.id ? (
            <CertForm
              key={cert.id}
              certification={cert}
              onClose={() => setEditing(null)}
            />
          ) : (
            <CertCard
              key={cert.id}
              certification={cert}
              onEdit={() => setEditing(cert.id)}
            />
          )
        )}

        {certifications.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">
            자격증을 추가해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CertCard({
  certification,
  onEdit,
}: {
  certification: Certification;
  onEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCertification(certification.id);
      if (result.success) toast.success("삭제되었습니다");
      else toast.error(result.error || "삭제에 실패했습니다");
    });
  }

  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div>
        <h4 className="text-sm font-medium">{certification.name}</h4>
        <p className="text-sm text-muted-foreground">{certification.issuer}</p>
        {certification.issueDate && (
          <p className="text-xs text-muted-foreground">
            {new Date(certification.issueDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
            })}
          </p>
        )}
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CertForm({
  certification,
  onClose,
}: {
  certification?: Certification;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CertificationInput>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: certification?.name ?? "",
      issuer: certification?.issuer ?? "",
      issueDate: certification?.issueDate
        ? new Date(certification.issueDate).toISOString().split("T")[0]
        : "",
      expiryDate: certification?.expiryDate
        ? new Date(certification.expiryDate).toISOString().split("T")[0]
        : "",
      credentialId: certification?.credentialId ?? "",
    },
  });

  function onSubmit(values: CertificationInput) {
    startTransition(async () => {
      const result = certification
        ? await updateCertification(certification.id, values)
        : await addCertification(values);

      if (result.success) {
        toast.success(certification ? "수정되었습니다" : "추가되었습니다");
        onClose();
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium">
          {certification ? "자격증 수정" : "자격증 추가"}
        </h4>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>자격증명</FormLabel>
                  <FormControl>
                    <Input placeholder="정보처리기사" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>발급기관</FormLabel>
                  <FormControl>
                    <Input placeholder="한국산업인력공단" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>취득일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>자격번호</FormLabel>
                  <FormControl>
                    <Input placeholder="선택사항" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {certification ? "수정" : "추가"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              취소
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

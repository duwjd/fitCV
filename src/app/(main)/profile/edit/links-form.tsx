"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { linksSchema, type LinksInput } from "@/lib/validations/profile";
import { updateLinks } from "@/actions/profile";
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
import { Loader2 } from "lucide-react";

interface Props {
  profile: {
    portfolioUrl?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
  } | null;
}

export function LinksForm({ profile }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LinksInput>({
    resolver: zodResolver(linksSchema),
    defaultValues: {
      portfolioUrl: profile?.portfolioUrl ?? "",
      linkedinUrl: profile?.linkedinUrl ?? "",
      githubUrl: profile?.githubUrl ?? "",
    },
  });

  function onSubmit(values: LinksInput) {
    startTransition(async () => {
      const result = await updateLinks(values);
      if (result.success) {
        toast.success("링크가 저장되었습니다");
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>링크</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>포트폴리오</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://portfolio.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResumeById, getResumeVersions } from "@/actions/resume";
import { VersionList } from "./version-list";

export const metadata: Metadata = {
  title: "버전 기록",
};

export default async function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResumeById(id);
  if (!resume) notFound();

  const versions = await getResumeVersions(id);

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/resumes/${id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            돌아가기
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{resume.title} - 버전 기록</CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length > 0 ? (
            <VersionList resumeId={id} versions={versions} />
          ) : (
            <p className="text-sm text-muted-foreground">
              버전 기록이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { FileText, PenTool, MessageSquare, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "대시보드",
};

const stats = [
  { label: "이력서", value: "0", icon: FileText, href: "/resumes" },
  { label: "자기소개서", value: "0", icon: PenTool, href: "/cover-letters" },
  { label: "모의면접", value: "0", icon: MessageSquare, href: "/interviews" },
  { label: "지원현황", value: "0", icon: Briefcase, href: "/jobs" },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="대시보드"
        description="커리어 현황을 한눈에 확인하세요"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">빠른 시작</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/resumes/new">
                <FileText className="mr-2 h-4 w-4" />
                새 이력서 만들기
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                채용공고 둘러보기
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/interviews/new">
                <MessageSquare className="mr-2 h-4 w-4" />
                모의면접 시작하기
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">추천 채용공고</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              프로필을 완성하면 맞춤 채용공고를 추천받을 수 있어요.
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/profile">프로필 완성하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

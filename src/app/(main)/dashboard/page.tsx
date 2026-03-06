import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Briefcase, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  getDashboardStats,
  getUpcomingDashboardEvents,
  getRecentActivity,
  getCareerGoals,
} from "@/actions/dashboard";
import { getProfile } from "@/actions/profile";
import { calculateProfileCompleteness } from "@/lib/profile-completeness";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ProfileCompletionBanner } from "@/components/dashboard/profile-completion-banner";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CareerGoalsWidget } from "@/components/dashboard/career-goals-widget";

export const metadata: Metadata = {
  title: "대시보드",
};

export default async function DashboardPage() {
  const [stats, events, activities, goals, profile] = await Promise.all([
    getDashboardStats(),
    getUpcomingDashboardEvents(),
    getRecentActivity(),
    getCareerGoals(),
    getProfile(),
  ]);

  const { percentage: completeness } = calculateProfileCompleteness(profile);

  return (
    <div>
      <PageHeader
        title="대시보드"
        description="커리어 현황을 한눈에 확인하세요"
      />

      <div className="space-y-6">
        {/* Profile Completion Banner */}
        <ProfileCompletionBanner percentage={completeness} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <UpcomingEvents events={JSON.parse(JSON.stringify(events))} />

            {/* Quick Actions */}
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CareerGoalsWidget goals={JSON.parse(JSON.stringify(goals))} />
            <RecentActivity activities={JSON.parse(JSON.stringify(activities))} />
          </div>
        </div>
      </div>
    </div>
  );
}

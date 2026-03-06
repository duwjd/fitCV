import Link from "next/link";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  type: string;
  title: string;
  date: Date;
  href: string;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;
  return new Date(date).toLocaleDateString("ko-KR");
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <Link
                key={i}
                href={activity.href}
                className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
              >
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    [{activity.type}]
                  </span>{" "}
                  {activity.title}
                </div>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(activity.date)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <Activity className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              아직 활동이 없습니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

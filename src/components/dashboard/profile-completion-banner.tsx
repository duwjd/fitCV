import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  percentage: number;
}

export function ProfileCompletionBanner({ percentage }: Props) {
  if (percentage >= 100) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            프로필을 {percentage}% 완성했어요!
          </p>
          <Progress value={percentage} className="mt-2 h-2" />
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/profile/edit">
            프로필 완성하기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

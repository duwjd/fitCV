import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProfile } from "@/actions/profile";
import { calculateProfileCompleteness } from "@/lib/profile-completeness";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  Target,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "프로필",
};

const EDUCATION_LABELS: Record<string, string> = {
  HIGH_SCHOOL: "고등학교",
  ASSOCIATE: "전문학사",
  BACHELOR: "학사",
  MASTER: "석사",
  DOCTORATE: "박사",
  OTHER: "기타",
};

const SKILL_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
  EXPERT: "전문가",
};

function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
  });
}

export default async function ProfilePage() {
  const profile = await getProfile();
  const completeness = calculateProfileCompleteness(profile);

  return (
    <div>
      <PageHeader title="프로필" description="커리어 정보를 관리하세요">
        <Button asChild variant="outline">
          <Link href="/profile/edit">편집</Link>
        </Button>
      </PageHeader>

      {/* Profile Completeness */}
      {completeness.percentage < 100 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                프로필 완성도 {completeness.percentage}%
              </span>
              {completeness.missingSections.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  미완성: {completeness.missingSections.join(", ")}
                </span>
              )}
            </div>
            <Progress value={completeness.percentage} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 기본 정보 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.nameKo ? (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">이름</dt>
                  <dd>
                    {profile.nameKo}
                    {profile.nameEn && (
                      <span className="ml-1 text-muted-foreground">
                        ({profile.nameEn})
                      </span>
                    )}
                  </dd>
                </div>
                {profile.phone && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">연락처</dt>
                    <dd>{profile.phone}</dd>
                  </div>
                )}
                {profile.birthDate && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">생년월일</dt>
                    <dd>
                      {new Date(profile.birthDate).toLocaleDateString("ko-KR")}
                    </dd>
                  </div>
                )}
                {profile.address && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">주소</dt>
                    <dd>{profile.address}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                프로필 정보를 입력해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 자기소개 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">자기소개</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.bio ? (
              <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                자기소개를 작성해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 경력 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">경력</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.workExperiences && profile.workExperiences.length > 0 ? (
              <div className="space-y-4">
                {profile.workExperiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{exp.position}</h4>
                      {exp.isCurrent && (
                        <Badge variant="secondary">재직중</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exp.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(exp.startDate)} ~{" "}
                      {exp.isCurrent ? "현재" : formatDate(exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="mt-1 text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                경력 사항을 추가해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 학력 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">학력</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.educations && profile.educations.length > 0 ? (
              <div className="space-y-4">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="border-l-2 pl-4">
                    <h4 className="text-sm font-medium">{edu.institution}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree && EDUCATION_LABELS[edu.degree]}
                      {edu.major && ` · ${edu.major}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(edu.startDate)} ~ {formatDate(edu.endDate)}
                      {edu.gpa && ` · GPA ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                학력 정보를 추가해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 스킬 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Code className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">스킬</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((ps) => (
                  <Badge key={ps.id} variant="outline">
                    {ps.skill.name}
                    <span className="ml-1 text-muted-foreground">
                      · {SKILL_LEVEL_LABELS[ps.level]}
                    </span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                보유 스킬을 추가해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 자격증 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">자격증</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-3">
                {profile.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h4 className="text-sm font-medium">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer}
                      {cert.issueDate && ` · ${formatDate(cert.issueDate)}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                자격증을 추가해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 희망 직무 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">희망 직무/조건</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.desiredRole || profile?.desiredIndustry ? (
              <dl className="space-y-3 text-sm">
                {profile.desiredRole && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">희망 직무</dt>
                    <dd>{profile.desiredRole}</dd>
                  </div>
                )}
                {profile.desiredIndustry && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">희망 산업</dt>
                    <dd>{profile.desiredIndustry}</dd>
                  </div>
                )}
                {profile.experienceYears != null && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">경력 연수</dt>
                    <dd>{profile.experienceYears}년</dd>
                  </div>
                )}
                {profile.salaryExpectation != null && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">희망 연봉</dt>
                    <dd>{profile.salaryExpectation.toLocaleString()}만원</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                희망 직무와 조건을 입력해주세요.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 링크 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">링크</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.portfolioUrl ||
            profile?.linkedinUrl ||
            profile?.githubUrl ? (
              <div className="space-y-2 text-sm">
                {profile.portfolioUrl && (
                  <div>
                    <span className="text-muted-foreground">포트폴리오: </span>
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {profile.portfolioUrl}
                    </a>
                  </div>
                )}
                {profile.linkedinUrl && (
                  <div>
                    <span className="text-muted-foreground">LinkedIn: </span>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {profile.linkedinUrl}
                    </a>
                  </div>
                )}
                {profile.githubUrl && (
                  <div>
                    <span className="text-muted-foreground">GitHub: </span>
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {profile.githubUrl}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                포트폴리오, LinkedIn, GitHub 링크를 추가해주세요.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import type { ResumeContent } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  content: ResumeContent;
}

export function ResumePreview({ content }: Props) {
  const { personalInfo, education, workExperience, certifications, skills, languages, awards, projects, summary } = content;

  return (
    <div className="space-y-4">
      {/* 인적사항 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">인적사항</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">이름: </span>
              {personalInfo.nameKo}
              {personalInfo.nameEn && ` (${personalInfo.nameEn})`}
            </div>
            {personalInfo.email && (
              <div>
                <span className="text-muted-foreground">이메일: </span>
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <span className="text-muted-foreground">연락처: </span>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.address && (
              <div>
                <span className="text-muted-foreground">주소: </span>
                {personalInfo.address}
              </div>
            )}
            {personalInfo.birthDate && (
              <div>
                <span className="text-muted-foreground">생년월일: </span>
                {personalInfo.birthDate}
              </div>
            )}
            {personalInfo.militaryService && (
              <div>
                <span className="text-muted-foreground">병역: </span>
                {personalInfo.militaryService}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 자기소개 */}
      {summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">자기소개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* 경력 */}
      {workExperience.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">경력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workExperience.map((exp, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{exp.company}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.position}
                      {exp.department && ` · ${exp.department}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {exp.startDate} ~ {exp.isCurrent ? "현재" : exp.endDate}
                  </span>
                </div>
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 학력 */}
      {education.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">학력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium">{edu.institution}</h4>
                  <p className="text-sm text-muted-foreground">
                    {edu.degree} · {edu.major}
                    {edu.gpa != null && ` (GPA ${edu.gpa}${edu.maxGpa ? `/${edu.maxGpa}` : ""})`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {edu.startDate} ~ {edu.endDate || "현재"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 스킬 */}
      {skills.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">스킬</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <Badge key={i} variant="secondary">
                  {skill.name}
                  {skill.level && ` (${skill.level})`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 자격증 */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">자격증</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-start justify-between text-sm">
                <div>
                  <span className="font-medium">{cert.name}</span>
                  <span className="text-muted-foreground"> · {cert.issuer}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {cert.issueDate}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 어학 */}
      {languages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">어학능력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {languages.map((lang, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{lang.language}</span>
                {lang.testName && (
                  <span className="text-muted-foreground">
                    {" "}
                    · {lang.testName} {lang.score}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 프로젝트 */}
      {projects.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">프로젝트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{proj.name}</h4>
                    {proj.role && (
                      <p className="text-xs text-muted-foreground">{proj.role}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {proj.startDate} ~ {proj.endDate || "현재"}
                  </span>
                </div>
                <p className="mt-1 text-sm">{proj.description}</p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.techStack.map((tech, j) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 수상/활동 */}
      {awards.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">수상/활동</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {awards.map((award, i) => (
              <div key={i} className="flex items-start justify-between text-sm">
                <div>
                  <span className="font-medium">{award.title}</span>
                  <span className="text-muted-foreground"> · {award.issuer}</span>
                </div>
                <span className="text-xs text-muted-foreground">{award.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

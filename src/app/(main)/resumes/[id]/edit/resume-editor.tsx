"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateResumeContent } from "@/actions/resume";
import type { ResumeContent } from "@/types/resume";

interface Props {
  resumeId: string;
  initialContent: ResumeContent;
}

export function ResumeEditor({ resumeId, initialContent }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [changeNote, setChangeNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof ResumeContent>(
    key: K,
    value: ResumeContent[K]
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateResumeContent(resumeId, content, changeNote);
      if (result.success) {
        toast.success("저장되었습니다");
        router.push(`/resumes/${resumeId}`);
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  const { personalInfo } = content;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">이력서 편집</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="변경 메모 (선택)"
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            className="w-48"
          />
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            저장
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="personal">인적사항</TabsTrigger>
          <TabsTrigger value="summary">자기소개</TabsTrigger>
          <TabsTrigger value="experience">경력</TabsTrigger>
          <TabsTrigger value="education">학력</TabsTrigger>
          <TabsTrigger value="skills">스킬/자격증</TabsTrigger>
          <TabsTrigger value="projects">프로젝트</TabsTrigger>
        </TabsList>

        {/* 인적사항 */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>인적사항</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>이름 (한국어)</Label>
                  <Input
                    value={personalInfo.nameKo}
                    onChange={(e) =>
                      updateField("personalInfo", {
                        ...personalInfo,
                        nameKo: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>이름 (영문)</Label>
                  <Input
                    value={personalInfo.nameEn ?? ""}
                    onChange={(e) =>
                      updateField("personalInfo", {
                        ...personalInfo,
                        nameEn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>이메일</Label>
                  <Input
                    value={personalInfo.email}
                    onChange={(e) =>
                      updateField("personalInfo", {
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>연락처</Label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) =>
                      updateField("personalInfo", {
                        ...personalInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>주소</Label>
                  <Input
                    value={personalInfo.address ?? ""}
                    onChange={(e) =>
                      updateField("personalInfo", {
                        ...personalInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>병역사항</Label>
                  <Input
                    value={personalInfo.militaryService ?? ""}
                    onChange={(e) =>
                      updateField("personalInfo", {
                        ...personalInfo,
                        militaryService: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 자기소개 */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>자기소개</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content.summary ?? ""}
                onChange={(e) => updateField("summary", e.target.value)}
                rows={6}
                placeholder="자기소개를 작성해주세요..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 경력 */}
        <TabsContent value="experience">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>경력</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField("workExperience", [
                    ...content.workExperience,
                    {
                      company: "",
                      position: "",
                      startDate: "",
                      isCurrent: false,
                      achievements: [],
                    },
                  ])
                }
              >
                추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.workExperience.map((exp, i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">경력 {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        updateField(
                          "workExperience",
                          content.workExperience.filter((_, j) => j !== i)
                        )
                      }
                    >
                      삭제
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>회사명</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...content.workExperience];
                          updated[i] = { ...exp, company: e.target.value };
                          updateField("workExperience", updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>직책</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => {
                          const updated = [...content.workExperience];
                          updated[i] = { ...exp, position: e.target.value };
                          updateField("workExperience", updated);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>주요 성과 (줄바꿈으로 구분)</Label>
                    <Textarea
                      value={exp.achievements.join("\n")}
                      onChange={(e) => {
                        const updated = [...content.workExperience];
                        updated[i] = {
                          ...exp,
                          achievements: e.target.value
                            .split("\n")
                            .filter(Boolean),
                        };
                        updateField("workExperience", updated);
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 학력 */}
        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>학력</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField("education", [
                    ...content.education,
                    { institution: "", degree: "", major: "", startDate: "" },
                  ])
                }
              >
                추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.education.map((edu, i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">학력 {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        updateField(
                          "education",
                          content.education.filter((_, j) => j !== i)
                        )
                      }
                    >
                      삭제
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>학교명</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...content.education];
                          updated[i] = { ...edu, institution: e.target.value };
                          updateField("education", updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>전공</Label>
                      <Input
                        value={edu.major}
                        onChange={(e) => {
                          const updated = [...content.education];
                          updated[i] = { ...edu, major: e.target.value };
                          updateField("education", updated);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 스킬/자격증 */}
        <TabsContent value="skills">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>스킬</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("skills", [
                      ...content.skills,
                      { name: "" },
                    ])
                  }
                >
                  추가
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => {
                          const updated = [...content.skills];
                          updated[i] = { ...skill, name: e.target.value };
                          updateField("skills", updated);
                        }}
                        className="w-32"
                        placeholder="스킬명"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() =>
                          updateField(
                            "skills",
                            content.skills.filter((_, j) => j !== i)
                          )
                        }
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>자격증</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("certifications", [
                      ...content.certifications,
                      { name: "", issuer: "", issueDate: "" },
                    ])
                  }
                >
                  추가
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {content.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border p-3"
                  >
                    <Input
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...content.certifications];
                        updated[i] = { ...cert, name: e.target.value };
                        updateField("certifications", updated);
                      }}
                      placeholder="자격증명"
                      className="flex-1"
                    />
                    <Input
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...content.certifications];
                        updated[i] = { ...cert, issuer: e.target.value };
                        updateField("certifications", updated);
                      }}
                      placeholder="발급기관"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        updateField(
                          "certifications",
                          content.certifications.filter((_, j) => j !== i)
                        )
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 프로젝트 */}
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>프로젝트</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateField("projects", [
                    ...content.projects,
                    { name: "", startDate: "", description: "" },
                  ])
                }
              >
                추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.projects.map((proj, i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      프로젝트 {i + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        updateField(
                          "projects",
                          content.projects.filter((_, j) => j !== i)
                        )
                      }
                    >
                      삭제
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>프로젝트명</Label>
                      <Input
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[i] = { ...proj, name: e.target.value };
                          updateField("projects", updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>역할</Label>
                      <Input
                        value={proj.role ?? ""}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[i] = { ...proj, role: e.target.value };
                          updateField("projects", updated);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>설명</Label>
                    <Textarea
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...content.projects];
                        updated[i] = { ...proj, description: e.target.value };
                        updateField("projects", updated);
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

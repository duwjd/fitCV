import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile } from "@/actions/profile";
import { BasicInfoForm } from "./basic-info-form";
import { CareerPreferencesForm } from "./career-preferences-form";
import { LinksForm } from "./links-form";
import { WorkExperienceSection } from "./work-experience-section";
import { EducationSection } from "./education-section";
import { CertificationSection } from "./certification-section";
import { SkillSection } from "./skill-section";

export const metadata: Metadata = {
  title: "프로필 편집",
};

export default async function ProfileEditPage() {
  const profile = await getProfile();

  return (
    <div>
      <PageHeader
        title="프로필 편집"
        description="커리어 정보를 입력하고 관리하세요"
      />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="career">희망 직무</TabsTrigger>
          <TabsTrigger value="experience">경력</TabsTrigger>
          <TabsTrigger value="education">학력</TabsTrigger>
          <TabsTrigger value="skills">스킬</TabsTrigger>
          <TabsTrigger value="certifications">자격증</TabsTrigger>
          <TabsTrigger value="links">링크</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoForm profile={profile} />
        </TabsContent>

        <TabsContent value="career">
          <CareerPreferencesForm profile={profile} />
        </TabsContent>

        <TabsContent value="experience">
          <WorkExperienceSection
            experiences={profile?.workExperiences ?? []}
          />
        </TabsContent>

        <TabsContent value="education">
          <EducationSection educations={profile?.educations ?? []} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillSection skills={profile?.skills ?? []} />
        </TabsContent>

        <TabsContent value="certifications">
          <CertificationSection
            certifications={profile?.certifications ?? []}
          />
        </TabsContent>

        <TabsContent value="links">
          <LinksForm profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

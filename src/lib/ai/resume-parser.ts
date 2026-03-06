import { anthropic, AI_MODEL } from "@/lib/claude";
import type { ResumeContent } from "@/types/resume";

const PARSE_PROMPT = `당신은 이력서/CV 텍스트를 구조화된 JSON으로 변환하는 전문 파서입니다.

아래 텍스트를 분석하여 다음 JSON 구조로 변환해주세요. 존재하지 않는 정보는 빈 문자열이나 빈 배열로 남겨두세요.

{
  "personalInfo": {
    "nameKo": "한국어 이름",
    "nameEn": "영문 이름 (있으면)",
    "phone": "전화번호",
    "email": "이메일",
    "address": "주소",
    "birthDate": "생년월일 (YYYY-MM-DD)",
    "militaryService": "병역사항 (군필/면제/해당없음)"
  },
  "education": [{
    "institution": "학교명",
    "degree": "학위 (고등학교/전문학사/학사/석사/박사)",
    "major": "전공",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM",
    "gpa": 0.0,
    "maxGpa": 4.5
  }],
  "workExperience": [{
    "company": "회사명",
    "position": "직책/직급",
    "department": "부서",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM",
    "isCurrent": false,
    "achievements": ["성과1", "성과2"]
  }],
  "certifications": [{
    "name": "자격증명",
    "issuer": "발급기관",
    "issueDate": "YYYY-MM"
  }],
  "skills": [{
    "name": "스킬명",
    "level": "상/중/하"
  }],
  "languages": [{
    "language": "언어명",
    "testName": "시험명 (TOEIC 등)",
    "score": "점수"
  }],
  "awards": [{
    "title": "수상명/활동명",
    "issuer": "주최기관",
    "date": "YYYY-MM"
  }],
  "projects": [{
    "name": "프로젝트명",
    "role": "역할",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM",
    "description": "설명",
    "techStack": ["기술1", "기술2"]
  }],
  "summary": "자기소개 요약"
}

반드시 유효한 JSON만 반환하세요. 다른 텍스트는 포함하지 마세요.`;

export async function parseResumeText(
  text: string
): Promise<ResumeContent> {
  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${PARSE_PROMPT}\n\n---\n이력서 텍스트:\n${text}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("AI 응답에서 텍스트를 추출할 수 없습니다");
  }

  return JSON.parse(content.text) as ResumeContent;
}

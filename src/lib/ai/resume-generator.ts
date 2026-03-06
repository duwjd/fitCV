import { anthropic, AI_MODEL } from "@/lib/claude";
import type { ResumeContent } from "@/types/resume";

const GENERATE_PROMPT = `당신은 한국 취업시장에 특화된 AI 이력서 최적화 전문가입니다.

주어진 프로필 데이터를 기반으로 채용공고에 맞춰 최적화된 이력서 내용을 생성해주세요.

최적화 규칙:
1. 채용공고의 핵심 요구사항과 매칭되는 경험/스킬을 강조
2. 성과는 수치화하여 표현 (가능한 경우)
3. 직무 관련 키워드를 자연스럽게 포함
4. 한국 이력서 양식에 맞는 격식체 사용
5. 불필요한 정보는 제외하되, 중요 정보는 누락하지 않음

반드시 유효한 JSON만 반환하세요. ResumeContent 타입 구조를 따르세요.`;

export async function generateOptimizedResume(
  profileData: ResumeContent,
  jobDescription?: string
): Promise<ResumeContent> {
  const userPrompt = jobDescription
    ? `${GENERATE_PROMPT}\n\n---\n프로필 데이터:\n${JSON.stringify(profileData, null, 2)}\n\n---\n채용공고:\n${jobDescription}`
    : `${GENERATE_PROMPT}\n\n---\n프로필 데이터:\n${JSON.stringify(profileData, null, 2)}\n\n채용공고 없이 일반적인 최적화를 수행해주세요.`;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("AI 응답에서 텍스트를 추출할 수 없습니다");
  }

  try {
    return JSON.parse(content.text) as ResumeContent;
  } catch {
    throw new Error("AI 응답을 JSON으로 파싱할 수 없습니다. 다시 시도해주세요.");
  }
}

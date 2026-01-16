import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { faqData } from "@/lib/faqData";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// FAQ 데이터를 컨텍스트로 변환
const faqContext = faqData
  .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}\n카테고리: ${faq.category}`)
  .join("\n\n");

const systemPrompt = `당신은 '등대(Lighthouse)'가 되어서 해변 정화를 하려는 사람들에게 정보를 알려주는 친절한 AI 어시스턴트입니다.

# 등대 소개
등대는 해양 환경 보호를 위한 다양한 활동을 진행하는 단체입니다.
- 반려해변: 해변을 반려동물처럼 입양하여 지속적으로 가꾸고 관리하는 프로그램. 2025년에는 영리기업, 비영리단체, 학교, 공공기관이 해변을 입양하여 정화 활동을 진행했습니다.
- 해봄: 해양 환경 보호를 위한 봉사 활동 프로그램
- 커뮤니티: 회원들이 소통하고 정보를 공유하는 공간

# 기본 정보
- 운영시간: 평일 09:30 - 17:00 (주말 및 공휴일 제외)
- 전화: 070-8015-4120
- 이메일: itaseoul@naver.com

# FAQ 데이터베이스
${faqContext}

# 응답 가이드라인
1. 사용자의 질문이 FAQ 데이터베이스에 있는 경우, 해당 답변을 참고하여 친절하게 답변하세요.
2. 반려해변은 반려동물과 관련이 없습니다. 해변을 입양하여 관리하는 프로그램입니다.
3. FAQ에 명확한 답변이 없는 경우, 다음과 같이 응답하세요:
   "죄송합니다. 해당 질문에 대한 답변이 아직 준비되지 않았습니다. 😥
   
   더 자세한 도움이 필요하시면 사무국으로 문의해주세요."
   
4. 답변에 연락처 정보(전화번호, 이메일, 운영시간)를 직접 포함하지 마세요. 연락처는 별도로 표시됩니다.
5. 항상 친절하고 공손한 말투를 사용하세요.
6. 이모지를 적절히 활용하여 친근한 분위기를 만드세요.
7. 답변은 간결하고 명확하게 작성하세요.
8. 등대의 프로그램(반려해변, 해봄)에 대한 긍정적인 태도를 유지하세요.`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "API key not configured",
          response: "죄송합니다. 현재 서비스를 이용할 수 없습니다. 사무국으로 직접 문의해주세요.",
          showContact: true,
        },
        { status: 200 }
      );
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg: any) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText =
      completion.choices[0].message.content || "죄송합니다. 응답을 생성할 수 없습니다.";

    // "죄송합니다" 또는 "준비되지 않았습니다"가 포함되어 있으면 연락처 표시
    const showContact =
      responseText.includes("죄송합니다") &&
      (responseText.includes("준비되지") || responseText.includes("준비 되지"));

    return NextResponse.json({
      response: responseText,
      showContact: showContact,
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    return NextResponse.json(
      {
        response:
          "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😥\n\n문제가 계속되면 사무국으로 문의해주세요.",
        showContact: true,
      },
      { status: 200 }
    );
  }
}

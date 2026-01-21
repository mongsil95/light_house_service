import { sendAnswerNotification } from "@/lib/email";
import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/qna/[id]/answers - Get all answers for a Q&A
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("qna_answers")
      .select("*")
      .eq("qna_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
  }
}

// POST /api/admin/qna/[id]/answers - Add answer to Q&A
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { id } = params;

    // Add answer
    const { data, error } = await supabase
      .from("qna_answers")
      .insert([
        {
          qna_id: parseInt(id),
          content: body.content,
          answerer_name: body.answerer_name || "전문가",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update Q&A status to answered
    await supabase.from("qna").update({ status: "answered" }).eq("id", id);

    // 질문 정보 가져오기 (이메일 알림 전송용)
    const { data: questionData } = await supabase
      .from("qna")
      .select("title, author_name, author_email")
      .eq("id", id)
      .single();

    // 질문자에게 답변 알림 이메일 전송
    if (questionData && questionData.author_email) {
      await sendAnswerNotification({
        questionId: parseInt(id),
        questionTitle: questionData.title,
        authorName: questionData.author_name,
        authorEmail: questionData.author_email,
        answererName: body.answerer_name || "전문가",
        answerContent: body.content,
      });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error adding answer:", error);
    return NextResponse.json({ error: "Failed to add answer" }, { status: 500 });
  }
}

// DELETE /api/admin/qna/[id]/answers - Delete an answer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { answer_id } = body;

    if (!answer_id) {
      return NextResponse.json({ error: "answer_id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("qna_answers").delete().eq("id", answer_id);

    if (error) throw error;

    return NextResponse.json({ message: "Answer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return NextResponse.json({ error: "Failed to delete answer" }, { status: 500 });
  }
}

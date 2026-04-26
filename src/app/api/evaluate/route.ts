import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question, answer, skill } = await req.json();
    const evaluation = await evaluateAnswer(question, answer, skill);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation API Error:", error);
    return NextResponse.json({ error: "Failed to evaluate" }, { status: 500 });
  }
}

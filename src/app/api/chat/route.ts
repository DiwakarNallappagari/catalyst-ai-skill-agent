import { NextRequest, NextResponse } from "next/server";
import { handleChat } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, history, resume, jd, skill } = await req.json();
    const result = await handleChat(message, history, resume, jd, skill);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}

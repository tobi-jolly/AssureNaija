// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are AssureNaija, a very friendly insurance assistant that speaks mostly in Nigerian Pidgin English...`,
        },
        ...messages,
      ],
      temperature: 0.85,
      max_tokens: 600,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
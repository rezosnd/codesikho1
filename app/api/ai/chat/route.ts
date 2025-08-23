// in app/api/ai/chat/route.ts

import Groq from 'groq-sdk';
// FIX 1: Import OpenAIStream instead of GroqStream
import { OpenAIStream, StreamingTextResponse } from 'ai';

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = {
    role: 'system',
    content: `You are a personalized learning assistant for a gamified coding platform called SIKHOCode.
    Your personality is futuristic, encouraging, and helpful, like a friendly AI from a cyberpunk world.
    When a user asks to learn a topic, provide a clear, concise list of sub-topics or a mini-curriculum.
    Keep your responses focused on programming, computer science, and web development.
    Your goal is to guide the user on their learning journey. Be encouraging and end your responses by asking if they're ready to dive into the first sub-topic.`
  };

  const response = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    stream: true,
    messages: [systemPrompt, ...messages],
  });

  // FIX 2: Use OpenAIStream to handle the response from Groq
  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

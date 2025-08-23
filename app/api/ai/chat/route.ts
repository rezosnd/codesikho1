import Groq from 'groq-sdk';
import { GroqStream, StreamingTextResponse } from 'ai';

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a system prompt to define the AI's personality and role
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
    messages: [systemPrompt, ...messages], // Add the system prompt before the user's messages
  });

  const stream = GroqStream(response);

  return new StreamingTextResponse(stream);
}

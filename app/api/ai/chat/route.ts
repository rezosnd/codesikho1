

import Groq from 'groq-sdk';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'nodejs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  // Get both the messages and the userProfile from the request body
  const { messages, userProfile } = await req.json();

  // The base instructions for the AI
  let systemContent = `You are a personalized learning assistant for a gamified coding platform called SIKHOCode.
    Your personality is futuristic, encouraging, and helpful, like a friendly AI from a cyberpunk world.
    When a user asks to learn a topic, provide a clear, concise list of sub-topics or a mini-curriculum.
    Keep your responses focused on programming, computer science, and web development.
    Your goal is to guide the user on their learning journey. Be encouraging and end your responses by asking if they're ready to dive into the first sub-topic.`;

  // If we have user profile data, add it to the AI's context
  if (userProfile) {
    const quizzesCompleted = userProfile.completedChallenges?.filter((id: string) => !id.startsWith("coding-")).length || 0;
    const challengesCompleted = userProfile.completedChallenges?.filter((id: string) => id.startsWith("coding-")).length || 0;

    systemContent += `

---
This is the current user's data. Use it to personalize your responses.
- Name: ${userProfile.displayName}
- Level: ${userProfile.level}
- XP: ${userProfile.xp}
- Quizzes Completed: ${quizzesCompleted}
- Coding Challenges Completed: ${challengesCompleted}
---
Address the user by their name. Tailor your learning suggestions to their current level. For example, if they are a low level, suggest beginner topics. If they are a high level, suggest more advanced topics.`;
  }

  const systemPrompt = {
    role: 'system',
    content: systemContent,
  };

  const response = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    stream: true,
    messages: [systemPrompt, ...messages],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

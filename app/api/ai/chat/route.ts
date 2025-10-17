import Groq from 'groq-sdk';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge'; // Changed to edge for better performance

// Validate API key on startup
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error("❌ Missing GROQ_API_KEY in environment variables!");
  console.error("Please add GROQ_API_KEY to your .env.local file");
}

const groq = new Groq({ 
  apiKey: apiKey 
});

export async function POST(req: Request) {
  // Check if API key is available
  if (!apiKey) {
    return new Response(
      JSON.stringify({ 
        error: "API configuration error",
        message: "Groq API key is not configured. Please contact the administrator."
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const { messages, userProfile } = await req.json();

    let systemContent = `You are a personalized learning assistant for a gamified coding platform called SIKHOCode.
    Your personality is futuristic, encouraging, and helpful, like a friendly AI from a cyberpunk world.
    When a user asks to learn a topic, provide a clear, concise list of sub-topics or a mini-curriculum.
    Keep your responses focused on programming, computer science, and web development.
    Your goal is to guide the user on their learning journey. Be encouraging and end your responses by asking if they're ready to dive into the first sub-topic.`;

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

    const systemPrompt = { role: 'system', content: systemContent };

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      stream: true,
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error("❌ Groq API Error:", error);
    
    // Handle specific error types
    let errorMessage = "AI service is temporarily unavailable";
    let statusCode = 500;

    if (error.status === 401) {
      errorMessage = "Invalid API key configuration";
      statusCode = 401;
    } else if (error.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
      statusCode = 429;
    } else if (error.message?.includes('API key')) {
      errorMessage = "Invalid API key. Please check your configuration.";
      statusCode = 401;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message || "Unknown error occurred"
      }),
      { 
        status: statusCode, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}

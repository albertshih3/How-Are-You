import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 10 requests per minute per IP
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset rate limit window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { mode, moodType, intensity, existingText } = body;

    // Validate required fields
    if (!mode || !moodType || intensity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: mode, moodType, intensity" },
        { status: 400 }
      );
    }

    if (mode !== "generate" && mode !== "continue") {
      return NextResponse.json(
        { error: "Invalid mode. Must be 'generate' or 'continue'" },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    if (mode === "generate") {
      // Generate mode: Create 3 writing prompts based on mood
      const prompt = `You are a supportive mental health journaling assistant. Generate 3 open-ended journaling prompts for someone feeling ${moodType} (intensity ${intensity}/10). Keep each under 15 words. Use "you" language. Focus on reflection, not advice. Return as JSON array: ["prompt1", "prompt2", "prompt3"]`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      try {
        // Try to parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const prompts = JSON.parse(jsonMatch[0]);
          if (Array.isArray(prompts) && prompts.length === 3) {
            return NextResponse.json({ prompts });
          }
        }

        // Fallback: split by newlines if JSON parsing fails
        const lines = text
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .slice(0, 3);

        if (lines.length === 3) {
          return NextResponse.json({ prompts: lines });
        }

        // Final fallback: generic prompts
        return NextResponse.json({
          prompts: [
            `What's making you feel ${moodType} right now?`,
            "What would help you process this feeling?",
            "What do you need in this moment?",
          ],
        });
      } catch (parseError) {
        // If parsing fails, return fallback prompts
        return NextResponse.json({
          prompts: [
            `What's making you feel ${moodType} right now?`,
            "What would help you process this feeling?",
            "What do you need in this moment?",
          ],
        });
      }
    } else {
      // Continue mode: Continue user's thought
      if (!existingText || existingText.trim().length === 0) {
        return NextResponse.json(
          { error: "existingText is required for continue mode" },
          { status: 400 }
        );
      }

      // Take last 100 characters for context
      const lastSentence = existingText.slice(-100).trim();

      const prompt = `The user is journaling about feeling ${moodType}. They wrote: "${lastSentence}". Continue this thought with 1-2 supportive sentences that encourage deeper reflection. Match their tone. Don't give advice. Just help them explore their feelings further.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const continuation = response.text();

      return NextResponse.json({ continuation: continuation.trim() });
    }
  } catch (error) {
    console.error("Error in writing-prompts API:", error);

    // Return more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

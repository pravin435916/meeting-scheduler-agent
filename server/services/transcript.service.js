import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCs_tR2jaOe5whnCbftIAg2FvyUZLMfSSE");
console.log("Key", process.env.GEMINI_API_KEY);
function extractJSON(text) {
  // Remove markdown code fences if present
  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract JSON between first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in LLM response");
  }

  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  return JSON.parse(cleaned);
}

export const analyzeTranscript = async (transcript) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an HR performance review assistant.

Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap output in backticks.

JSON schema:
{
  "action_items": [
    {
      "owner": "Employee | Manager",
      "task": "string",
      "deadline": "string or null"
    }
  ],
  "goals": ["string"],
  "follow_ups": ["string"]
}

Transcript:
"""
${transcript}
"""
`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  try {
    return extractJSON(rawText);
  } catch (err) {
    console.error("Raw Gemini Response:", rawText);
    throw err;
  }
};

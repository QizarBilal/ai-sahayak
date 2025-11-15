import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  return response.text || "";
}

export async function generateStructuredResponse<T>(
  prompt: string,
  responseSchema: any,
  systemInstruction?: string
): Promise<T> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    config: {
      systemInstruction: systemInstruction || "",
      responseMimeType: "application/json",
      responseSchema,
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (rawJson) {
    return JSON.parse(rawJson) as T;
  }

  throw new Error("Empty response from model");
}

export async function chatWithHistory(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  const contents = [
    ...history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: contents as any,
    config: {
      systemInstruction: "You are AI-Sahayak, a helpful assistant for rural Indian citizens seeking government services and information. Provide clear, simple answers in everyday language. Be supportive and patient.",
    },
  });

  return response.text || "";
}

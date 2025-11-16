import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Fallback response
    return "I apologize, but I'm currently unable to process your request due to high demand. Please try again in a few moments.";
  }
}

export async function generateStructuredResponse<T>(
  prompt: string,
  responseSchema: any,
  systemInstruction?: string
): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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
  } catch (error: any) {
    console.error("Gemini structured response error:", error);
    throw error;
  }
}

export async function chatWithHistory(conversationHistory: any[], newMessage: string, language: string = 'en'): Promise<string> {
  const languageInstruction = language !== 'en' 
    ? ` Respond in ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : language === 'bn' ? 'Bengali' : language === 'mr' ? 'Marathi' : language === 'gu' ? 'Gujarati' : language === 'kn' ? 'Kannada' : language === 'ml' ? 'Malayalam' : language === 'pa' ? 'Punjabi' : 'English'} language.`
    : '';
  
  let prompt = "Conversation history:\n";
  conversationHistory.forEach(msg => {
    prompt += `${msg.role}: ${msg.content}\n`;
  });
  prompt += `\nUser: ${newMessage}\n\nAssistant:`;

  const systemInstruction = `You are AI-Sahayak, a helpful assistant for government services in India. Be helpful, concise, and informative.${languageInstruction}`;
  return await generateText(prompt, systemInstruction);
}

// Eligibility checker with reasoning
export async function checkEligibility(
  schemeName: string,
  schemeCategory: string,
  userDetails: {
    age?: number;
    income?: number;
    occupation?: string;
    state?: string;
    gender?: string;
    caste?: string;
    [key: string]: any;
  }
): Promise<{
  eligible: boolean;
  reason: string;
  requiredDocuments: string[];
  nextSteps: string[];
}> {
  const prompt = `As an expert on Indian government schemes, analyze eligibility for the following:

Scheme: ${schemeName}
Category: ${schemeCategory}
User Details: ${JSON.stringify(userDetails, null, 2)}

Provide a detailed eligibility analysis including:
1. Whether the user is eligible (true/false)
2. Clear explanation of why they are or aren't eligible
3. List of required documents they need to apply
4. Step-by-step next actions they should take

Be specific and helpful. Consider all government scheme criteria including age, income, occupation, location, etc.`;

  const schema = {
    type: "object",
    properties: {
      eligible: { type: "boolean" },
      reason: { type: "string" },
      requiredDocuments: {
        type: "array",
        items: { type: "string" }
      },
      nextSteps: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["eligible", "reason", "requiredDocuments", "nextSteps"]
  };

  return await generateStructuredResponse(prompt, schema);
}

// Document summarization
export async function summarizeDocument(text: string, language?: string): Promise<string> {
  const prompt = `Summarize the following document in simple, clear language${language ? ` in ${language}` : ''}. Focus on the key points and make it easy to understand for someone with limited literacy:

${text}

Provide a concise summary highlighting the most important information.`;

  return await generateText(prompt);
}

// Translation
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const prompt = `Translate the following text to ${targetLanguage}. Keep the translation simple and clear:

${text}`;

  return await generateText(prompt);
}

// Draft generation
export async function generateDraft(
  draftType: string,
  purpose: string,
  details: Record<string, any>
): Promise<string> {
  const prompt = `Generate a formal ${draftType} for the following purpose: ${purpose}

User Details:
${JSON.stringify(details, null, 2)}

Create a properly formatted, professional document that can be used for official purposes. Include all necessary sections and use appropriate formal language.`;

  return await generateText(prompt);
}

// Voice assistant response generation
export async function generateVoiceResponse(query: string, language: string = 'en'): Promise<string> {
  const languageInstruction = language !== 'en' 
    ? ` Respond in ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : language === 'bn' ? 'Bengali' : language === 'mr' ? 'Marathi' : language === 'gu' ? 'Gujarati' : language === 'kn' ? 'Kannada' : language === 'ml' ? 'Malayalam' : language === 'pa' ? 'Punjabi' : 'English'} language.`
    : '';
  
  const prompt = `You are AI-Sahayak voice assistant. A user asked: "${query}"

Provide a helpful, concise response in simple language suitable for voice output. Keep it conversational and easy to understand. Limit to 2-3 sentences unless more detail is absolutely necessary.${languageInstruction}`;

  return await generateText(prompt, `You are a helpful voice assistant for rural Indian citizens. Speak clearly and simply.${languageInstruction}`);
}

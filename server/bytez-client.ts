import Bytez from "bytez";
import FormData from "form-data";

if (!process.env.BYTEZ_API_KEY) {
  throw new Error("BYTEZ_API_KEY must be set");
}

const bytez = new Bytez(process.env.BYTEZ_API_KEY);

// Speech-to-Text using Whisper-large-v3
export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename: "audio.webm",
      contentType: mimeType,
    });

    const response = await bytez.audio.transcribe({
      file: formData,
      model: "openai/whisper-large-v3",
    });

    return response.text || "";
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error("Failed to transcribe audio");
  }
}

// Text-to-Speech using Bark
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  try {
    const response = await bytez.audio.generate({
      model: "suno/bark",
      prompt: text,
    });

    // Response contains audio data as buffer
    return Buffer.from(response.audio || "");
  } catch (error) {
    console.error("TTS error:", error);
    throw new Error("Failed to synthesize speech");
  }
}

// Generate audio notification earcons using MusicGen
export async function generateEarcon(description: string): Promise<Buffer> {
  try {
    const response = await bytez.audio.generate({
      model: "facebook/musicgen-stereo-melody",
      prompt: description,
    });

    return Buffer.from(response.audio || "");
  } catch (error) {
    console.error("Earcon generation error:", error);
    throw new Error("Failed to generate earcon");
  }
}

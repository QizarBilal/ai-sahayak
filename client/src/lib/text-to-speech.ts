/**
 * Text-to-Speech Service using Bytez Bark API
 */

const BYTEZ_API_KEY = "6209d315f9cebbde00b814ef01448166";

export async function speakText(text: string): Promise<void> {
  try {
    // First try Bytez Bark API
    const response = await fetch("/api/voice/synthesize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      await audio.play();
      return;
    }
  } catch (error) {
    console.warn("Bytez TTS failed, falling back to Web Speech API:", error);
  }

  // Fallback to Web Speech API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN'; // Indian English
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Try to find an Indian English voice
    const voices = speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => 
      voice.lang.includes('en-IN') || voice.name.includes('Indian')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    
    speechSynthesis.speak(utterance);
  } else {
    throw new Error("Text-to-speech not supported");
  }
}

export async function speakTextDirect(text: string): Promise<void> {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    const voices = speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => 
      voice.lang.includes('en-IN') || voice.name.includes('Indian')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    
    speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

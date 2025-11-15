import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MicrophoneButton } from "@/components/microphone-button";
import { WaveformVisualization } from "@/components/waveform-visualization";
import { AudioPlayer } from "@/components/audio-player";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Volume2, Loader2 } from "lucide-react";

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [responseAudioUrl, setResponseAudioUrl] = useState("");
  const { toast } = useToast();

  const transcribeMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      return apiRequest("POST", "/api/voice/transcribe", formData);
    },
    onSuccess: async (data: { transcript: string }) => {
      setTranscript(data.transcript);
      await generateResponse(data.transcript);
    },
    onError: () => {
      toast({
        title: "Transcription failed",
        description: "Could not process your audio. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateResponse = async (text: string) => {
    try {
      const chatData: any = await apiRequest("POST", "/api/chat", { message: text, mode: "voice" });
      setResponse(chatData.response);
      
      // Generate TTS
      const ttsData: any = await apiRequest("POST", "/api/voice/synthesize", { text: chatData.response });
      setResponseAudioUrl(ttsData.audioUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not generate response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setResponse("");
    setResponseAudioUrl("");
    // Recording logic will be handled by browser MediaRecorder API
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulated - in real implementation, stop MediaRecorder and send blob
    toast({
      title: "Processing...",
      description: "Transcribing your audio",
    });
  };

  const speakText = async (text: string) => {
    try {
      const data: any = await apiRequest("POST", "/api/voice/synthesize", { text });
      setResponseAudioUrl(data.audioUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not synthesize speech.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Voice Assistant</h1>
        <p className="text-lg text-muted-foreground">
          Press the microphone button and speak your question. The AI will respond with both text and voice.
        </p>
      </div>

      {/* Main Recording Area */}
      <Card className="mb-8">
        <CardContent className="p-12 flex flex-col items-center gap-8">
          <div className="w-full max-w-md">
            <WaveformVisualization isActive={isRecording} />
          </div>

          <MicrophoneButton
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            size="large"
          />

          <p className="text-center text-lg text-muted-foreground">
            {isRecording
              ? "Listening... Speak clearly into your microphone"
              : "Press the microphone to start recording"}
          </p>
        </CardContent>
      </Card>

      {/* Transcript */}
      {transcript && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>You said:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakText(transcript)}
                data-testid="button-speak-transcript"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg" data-testid="text-transcript">{transcript}</p>
          </CardContent>
        </Card>
      )}

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>AI Response:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakText(response)}
                data-testid="button-speak-response"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg" data-testid="text-response">{response}</p>
            
            {responseAudioUrl && (
              <AudioPlayer audioUrl={responseAudioUrl} autoPlay />
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {transcribeMutation.isPending && (
        <Card>
          <CardContent className="p-12 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Processing your audio...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

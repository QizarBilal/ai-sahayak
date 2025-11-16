import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface MicrophoneButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onTranscript?: (text: string) => void;
  isProcessing?: boolean;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  size?: "sm" | "md" | "lg";
}

export function MicrophoneButton({ 
  onRecordingComplete, 
  onTranscript,
  isProcessing = false 
}: MicrophoneButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if available (fallback)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal && onTranscript) {
          onTranscript(transcript);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start Web Speech API as fallback
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.log("Speech recognition already started or not available");
        }
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleClick = () => {
    if (isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      size="lg"
      variant={isRecording ? "destructive" : "default"}
      onClick={handleClick}
      disabled={isProcessing}
      className="rounded-full w-24 h-24 p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      {isProcessing ? (
        <Loader2 className="w-12 h-12 animate-spin" />
      ) : isRecording ? (
        <MicOff className="w-12 h-12" />
      ) : (
        <Mic className="w-12 h-12" />
      )}
    </Button>
  );
}

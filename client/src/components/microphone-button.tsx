import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MicrophoneButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  size?: "default" | "large";
  className?: string;
}

export function MicrophoneButton({
  isRecording,
  onStartRecording,
  onStopRecording,
  size = "default",
  className,
}: MicrophoneButtonProps) {
  return (
    <Button
      onClick={isRecording ? onStopRecording : onStartRecording}
      data-testid={isRecording ? "button-stop-recording" : "button-start-recording"}
      variant={isRecording ? "destructive" : "default"}
      size={size === "large" ? "default" : "icon"}
      className={cn(
        size === "large" && "h-20 w-20 rounded-full text-lg",
        isRecording && "animate-pulse",
        className
      )}
    >
      {isRecording ? (
        <Square className={size === "large" ? "h-10 w-10" : "h-5 w-5"} />
      ) : (
        <Mic className={size === "large" ? "h-10 w-10" : "h-5 w-5"} />
      )}
      {size === "large" && (
        <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
      )}
    </Button>
  );
}

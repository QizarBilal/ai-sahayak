import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveformVisualizationProps {
  isActive: boolean;
  className?: string;
}

export function WaveformVisualization({ isActive, className }: WaveformVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 40;
    const barWidth = canvas.width / bars;
    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(phase + i * 0.3) * (canvas.height / 3) + canvas.height / 2;
        const x = i * barWidth;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "hsl(207, 90%, 54%)");
        gradient.addColorStop(1, "hsl(180, 100%, 50%)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height / 2 - height / 2, barWidth - 2, height);
      }

      phase += 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      className={cn("w-full h-auto rounded-md", className)}
      data-testid="canvas-waveform"
    />
  );
}

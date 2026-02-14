import { useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  stream: MediaStream | null;
  onCapture: (imageBlob: Blob) => void;
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

/**
 * Live camera viewfinder with capture and file-upload buttons.
 */
export function CameraView({ stream, onCapture, onFileSelect, onClose }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Attach stream to video element
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [stream]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
      },
      'image/jpeg',
      0.9,
    );
  }, [onCapture]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Video feed */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-black">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <p className="text-sm">Camera not available</p>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      <p className="text-xs text-muted-foreground text-center max-w-sm">
        Aim at the ingredients list (not nutrition facts) for best results.
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        {stream && (
          <Button
            onClick={handleCapture}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold gap-2"
          >
            <Camera className="h-5 w-5" />
            Capture
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full px-6 py-6 text-base font-semibold gap-2 border-border text-foreground hover:bg-accent"
        >
          <Upload className="h-5 w-5" />
          Upload Photo
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

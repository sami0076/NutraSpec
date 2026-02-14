import { useState, useRef, useCallback } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  /** base64-encoded audio (MP3). */
  audioBase64: string;
}

/**
 * Plays base64-encoded audio from the ElevenLabs TTS response.
 */
export function AudioPlayer({ audioBase64 }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
      audio.addEventListener('ended', () => setPlaying(false));
      audioRef.current = audio;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [audioBase64, playing]);

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
    >
      <Volume2 className="h-4 w-4 text-primary" />
      {playing ? (
        <>
          <Pause className="h-4 w-4" />
          Pause Audio
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          Listen to Summary
        </>
      )}
    </button>
  );
}

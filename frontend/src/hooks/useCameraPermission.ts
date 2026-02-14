import { useState, useCallback, useEffect } from 'react';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

interface UseCameraPermissionReturn {
  status: PermissionState;
  stream: MediaStream | null;
  requestCamera: () => Promise<MediaStream | null>;
  stopCamera: () => void;
}

/**
 * Hook for browser camera permission (navigator.mediaDevices).
 * Manages the media stream lifecycle.
 */
export function useCameraPermission(): UseCameraPermissionReturn {
  const [status, setStatus] = useState<PermissionState>('prompt');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      return null;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(mediaStream);
      setStatus('granted');
      return mediaStream;
    } catch {
      setStatus('denied');
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, stream, requestCamera, stopCamera };
}

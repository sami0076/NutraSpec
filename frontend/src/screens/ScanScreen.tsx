import { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ScanLine, Leaf } from 'lucide-react';
import { CameraView } from '@/components/CameraView';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useUser } from '@/context/UserContext';

export default function ScanScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { analyze, loading, error } = useAnalyze();
  const { stream, status, requestCamera, stopCamera } = useCameraPermission();
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    await requestCamera();
    setCameraActive(true);
  }, [requestCamera]);

  const closeCamera = useCallback(() => {
    stopCamera();
    setCameraActive(false);
  }, [stopCamera]);

  const handleImage = useCallback(
    async (imageBlob: Blob | File) => {
      stopCamera();
      setCameraActive(false);

      // user_id is extracted from the Supabase JWT on the backend
      const result = await analyze({
        image: imageBlob,
        includeAudio: true,
      });

      if (result) {
        navigate('/result', { state: { result } });
      }
    },
    [analyze, navigate, stopCamera],
  );

  return (
    <div className="min-h-screen bg-background">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">
              FoodFinder<span className="text-primary">.AI</span>
            </span>
          </div>
          <Link
            to="/profile"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Profile
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {!cameraActive ? (
          /* Landing state — prompt to scan */
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ScanLine className="h-10 w-10" />
            </div>

            <h1 className="mt-6 text-3xl font-light tracking-tight text-foreground font-serif md:text-4xl">
              Scan a food label
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground font-light">
              Point your camera at an ingredient list or upload a photo. We{"'"}ll
              analyze every ingredient against your dietary profile.
            </p>

            {error && (
              <div className="mt-6 w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button
                onClick={startCamera}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold gap-2"
              >
                <ScanLine className="h-5 w-5" />
                Open Camera
              </Button>

              <label className="cursor-pointer">
                <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-transparent px-8 py-6 text-base font-semibold text-foreground transition-colors hover:bg-accent gap-2">
                  Upload Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImage(file);
                  }}
                />
              </label>
            </div>

            {status === 'denied' && (
              <p className="mt-6 text-sm text-destructive">
                Camera access was denied. Please enable it in your browser settings, or upload a photo instead.
              </p>
            )}
            {status === 'unsupported' && (
              <p className="mt-6 text-sm text-muted-foreground">
                Camera is not available on this device. Please upload a photo instead.
              </p>
            )}

            {!user && (
              <p className="mt-8 text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">
                  Sign in
                </Link>{' '}
                for personalized risk scoring based on your allergies and diet.
              </p>
            )}
          </div>
        ) : (
          /* Camera active */
          <CameraView
            stream={stream}
            onCapture={handleImage}
            onFileSelect={handleImage}
            onClose={closeCamera}
          />
        )}
      </div>
    </div>
  );
}

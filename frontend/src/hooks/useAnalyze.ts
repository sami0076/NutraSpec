import { useState, useCallback } from 'react';
import { analyzeImage, type AnalyzeOptions } from '@/services/analyzeService';
import type { AnalyzeResult } from '@/types/scanTypes';
import { toErrorMessage } from '@/utils/errorHandler';

interface UseAnalyzeReturn {
  result: AnalyzeResult | null;
  loading: boolean;
  error: string | null;
  analyze: (opts: AnalyzeOptions) => Promise<AnalyzeResult | null>;
  reset: () => void;
}

/**
 * Hook wrapping analyzeService for the scan flow.
 * Manages loading / error / result state.
 */
export function useAnalyze(): UseAnalyzeReturn {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (opts: AnalyzeOptions) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeImage(opts);
      setResult(data);
      return data;
    } catch (err) {
      const msg = toErrorMessage(err);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, analyze, reset };
}

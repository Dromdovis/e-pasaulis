import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  message: string;
}

export function useLoadingState(initialMessage = '') {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    message: initialMessage,
  });

  const startLoading = useCallback((message = '') => {
    setState({ isLoading: true, error: null, message });
  }, []);

  const stopLoading = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState({ isLoading: false, error, message: '' });
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, message: '' });
  }, []);

  return { ...state, startLoading, stopLoading, setError, reset };
} 
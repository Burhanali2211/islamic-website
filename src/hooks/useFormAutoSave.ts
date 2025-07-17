import { useEffect, useCallback, useRef } from 'react';
import { localStorageService } from '../services/localStorage';
import { useSupabaseApp } from '../context/SupabaseContext';

export interface UseFormAutoSaveOptions {
  formId: string;
  autoSaveInterval?: number; // milliseconds
  enabled?: boolean;
  onRestore?: (data: Record<string, any>) => void;
  onSave?: (data: Record<string, any>) => void;
}

export function useFormAutoSave(options: UseFormAutoSaveOptions) {
  const { state } = useSupabaseApp();
  const {
    formId,
    autoSaveInterval = 5000, // 5 seconds default
    enabled = true,
    onRestore,
    onSave
  } = options;

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Save form data to local storage
  const saveFormData = useCallback((formData: Record<string, any>) => {
    if (!enabled || !state.user) return false;

    const dataString = JSON.stringify(formData);
    
    // Only save if data has changed
    if (dataString === lastSavedDataRef.current) {
      return false;
    }

    const success = localStorageService.saveFormData(formId, formData, state.user.id);
    
    if (success) {
      lastSavedDataRef.current = dataString;
      onSave?.(formData);
    }

    return success;
  }, [formId, enabled, state.user, onSave]);

  // Load saved form data
  const loadFormData = useCallback(() => {
    if (!enabled) return null;

    const savedData = localStorageService.getFormData(formId);
    
    if (savedData && savedData.userId === state.user?.id) {
      onRestore?.(savedData.fields);
      return savedData.fields;
    }

    return null;
  }, [formId, enabled, state.user, onRestore]);

  // Clear saved form data
  const clearFormData = useCallback(() => {
    const success = localStorageService.clearFormData(formId);
    lastSavedDataRef.current = '';
    return success;
  }, [formId]);

  // Auto-save with debouncing
  const scheduleAutoSave = useCallback((formData: Record<string, any>) => {
    if (!enabled) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Schedule new save
    autoSaveTimerRef.current = setTimeout(() => {
      saveFormData(formData);
    }, autoSaveInterval);
  }, [enabled, autoSaveInterval, saveFormData]);

  // Manual save (immediate)
  const saveNow = useCallback((formData: Record<string, any>) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    return saveFormData(formData);
  }, [saveFormData]);

  // Check if there's saved data on mount
  useEffect(() => {
    if (enabled && state.user) {
      loadFormData();
    }
  }, [enabled, state.user, loadFormData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    saveFormData: scheduleAutoSave,
    saveNow,
    loadFormData,
    clearFormData,
    hasSavedData: () => {
      const savedData = localStorageService.getFormData(formId);
      return savedData && savedData.userId === state.user?.id;
    }
  };
}

// Hook for quiz progress auto-save
export function useQuizAutoSave(quizId: string) {
  const { state } = useSupabaseApp();

  const saveQuizProgress = useCallback((answers: Record<string, string>, currentQuestion: number, timeRemaining?: number) => {
    if (!state.user) return false;

    return localStorageService.saveQuizProgress({
      quizId,
      answers,
      currentQuestion,
      timeRemaining,
      timestamp: Date.now(),
      userId: state.user.id
    });
  }, [quizId, state.user]);

  const loadQuizProgress = useCallback(() => {
    const progress = localStorageService.getQuizProgress(quizId);
    
    if (progress && progress.userId === state.user?.id) {
      return progress;
    }

    return null;
  }, [quizId, state.user]);

  const clearQuizProgress = useCallback(() => {
    return localStorageService.clearQuizProgress(quizId);
  }, [quizId]);

  return {
    saveQuizProgress,
    loadQuizProgress,
    clearQuizProgress,
    hasProgress: () => {
      const progress = localStorageService.getQuizProgress(quizId);
      return progress && progress.userId === state.user?.id;
    }
  };
}

// Hook for draft management
export function useDraftManager(type: 'book' | 'assignment' | 'quiz' | 'course' | 'user' | 'category') {
  const { state, saveDraft, getDraft, clearDraft } = useSupabaseApp();

  const saveDraftData = useCallback((id: string, data: any) => {
    return saveDraft(type, id, data);
  }, [type, saveDraft]);

  const loadDraftData = useCallback((id: string) => {
    return getDraft(type, id);
  }, [type, getDraft]);

  const clearDraftData = useCallback((id: string) => {
    return clearDraft(type, id);
  }, [type, clearDraft]);

  const getUserDrafts = useCallback(() => {
    if (!state.user) return [];
    return localStorageService.getUserDrafts(state.user.id).filter(draft => draft.type === type);
  }, [type, state.user]);

  return {
    saveDraft: saveDraftData,
    loadDraft: loadDraftData,
    clearDraft: clearDraftData,
    getUserDrafts,
    hasDraft: (id: string) => {
      const draft = getDraft(type, id);
      return draft !== null;
    }
  };
}

// Hook for managing user preferences in local storage
export function useLocalPreferences() {
  const saveBookmarks = useCallback((bookmarks: string[]) => {
    return localStorageService.saveBookmarks(bookmarks);
  }, []);

  const getBookmarks = useCallback(() => {
    return localStorageService.getBookmarks();
  }, []);

  const saveRecentReads = useCallback((recentReads: string[]) => {
    return localStorageService.saveRecentReads(recentReads);
  }, []);

  const getRecentReads = useCallback(() => {
    return localStorageService.getRecentReads();
  }, []);

  const saveSettings = useCallback((settings: Record<string, any>) => {
    return localStorageService.saveSettings(settings);
  }, []);

  const getSettings = useCallback(() => {
    return localStorageService.getSettings();
  }, []);

  const clearAllData = useCallback(() => {
    return localStorageService.clearAllData();
  }, []);

  const getStorageInfo = useCallback(() => {
    return localStorageService.getStorageInfo();
  }, []);

  return {
    saveBookmarks,
    getBookmarks,
    saveRecentReads,
    getRecentReads,
    saveSettings,
    getSettings,
    clearAllData,
    getStorageInfo
  };
}

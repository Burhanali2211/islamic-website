// Local Storage Service for Draft Management
// Handles temporary data storage before saving to database

export interface DraftData {
  id: string;
  type: 'book' | 'assignment' | 'quiz' | 'course' | 'user' | 'category';
  data: Record<string, any>;
  userId: string;
  timestamp: number;
  autoSave?: boolean;
}

export interface FormDraft {
  formId: string;
  fields: Record<string, any>;
  timestamp: number;
  userId: string;
}

export interface QuizDraft {
  quizId: string;
  answers: Record<string, string>;
  currentQuestion: number;
  timeRemaining?: number;
  timestamp: number;
  userId: string;
}

class LocalStorageService {
  private readonly DRAFT_PREFIX = 'idarah_draft_';
  private readonly FORM_PREFIX = 'idarah_form_';
  private readonly QUIZ_PREFIX = 'idarah_quiz_';
  private readonly BOOKMARK_KEY = 'idarah_bookmarks';
  private readonly RECENT_READS_KEY = 'idarah_recent_reads';
  private readonly SETTINGS_KEY = 'idarah_settings';
  private readonly MAX_DRAFTS = 50;
  private readonly DRAFT_EXPIRY_DAYS = 7;

  // ============================================================================
  // DRAFT MANAGEMENT
  // ============================================================================

  // Save draft data
  saveDraft(draft: DraftData): boolean {
    try {
      const key = `${this.DRAFT_PREFIX}${draft.type}_${draft.id}`;
      const draftWithTimestamp = {
        ...draft,
        timestamp: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(draftWithTimestamp));
      this.cleanupExpiredDrafts();
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  // Get draft by ID and type
  getDraft(type: string, id: string): DraftData | null {
    try {
      const key = `${this.DRAFT_PREFIX}${type}_${id}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) return null;
      
      const draft = JSON.parse(stored) as DraftData;
      
      // Check if draft has expired
      const daysSinceCreated = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated > this.DRAFT_EXPIRY_DAYS) {
        this.deleteDraft(type, id);
        return null;
      }
      
      return draft;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  // Get all drafts for a user
  getUserDrafts(userId: string): DraftData[] {
    try {
      const drafts: DraftData[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.DRAFT_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const draft = JSON.parse(stored) as DraftData;
            if (draft.userId === userId) {
              drafts.push(draft);
            }
          }
        }
      }
      
      return drafts.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting user drafts:', error);
      return [];
    }
  }

  // Delete draft
  deleteDraft(type: string, id: string): boolean {
    try {
      const key = `${this.DRAFT_PREFIX}${type}_${id}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
  }

  // Clean up expired drafts
  private cleanupExpiredDrafts(): void {
    try {
      const keysToDelete: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.DRAFT_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const draft = JSON.parse(stored) as DraftData;
            const daysSinceCreated = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24);
            
            if (daysSinceCreated > this.DRAFT_EXPIRY_DAYS) {
              keysToDelete.push(key);
            }
          }
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error cleaning up drafts:', error);
    }
  }

  // ============================================================================
  // FORM AUTO-SAVE
  // ============================================================================

  // Save form data
  saveFormData(formId: string, fields: Record<string, any>, userId: string): boolean {
    try {
      const key = `${this.FORM_PREFIX}${formId}`;
      const formDraft: FormDraft = {
        formId,
        fields,
        timestamp: Date.now(),
        userId
      };
      
      localStorage.setItem(key, JSON.stringify(formDraft));
      return true;
    } catch (error) {
      console.error('Error saving form data:', error);
      return false;
    }
  }

  // Get form data
  getFormData(formId: string): FormDraft | null {
    try {
      const key = `${this.FORM_PREFIX}${formId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) return null;
      
      return JSON.parse(stored) as FormDraft;
    } catch (error) {
      console.error('Error getting form data:', error);
      return null;
    }
  }

  // Clear form data
  clearFormData(formId: string): boolean {
    try {
      const key = `${this.FORM_PREFIX}${formId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing form data:', error);
      return false;
    }
  }

  // ============================================================================
  // QUIZ PROGRESS
  // ============================================================================

  // Save quiz progress
  saveQuizProgress(quizDraft: QuizDraft): boolean {
    try {
      const key = `${this.QUIZ_PREFIX}${quizDraft.quizId}`;
      localStorage.setItem(key, JSON.stringify(quizDraft));
      return true;
    } catch (error) {
      console.error('Error saving quiz progress:', error);
      return false;
    }
  }

  // Get quiz progress
  getQuizProgress(quizId: string): QuizDraft | null {
    try {
      const key = `${this.QUIZ_PREFIX}${quizId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) return null;
      
      return JSON.parse(stored) as QuizDraft;
    } catch (error) {
      console.error('Error getting quiz progress:', error);
      return null;
    }
  }

  // Clear quiz progress
  clearQuizProgress(quizId: string): boolean {
    try {
      const key = `${this.QUIZ_PREFIX}${quizId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing quiz progress:', error);
      return false;
    }
  }

  // ============================================================================
  // USER PREFERENCES
  // ============================================================================

  // Save bookmarks
  saveBookmarks(bookmarks: string[]): boolean {
    try {
      localStorage.setItem(this.BOOKMARK_KEY, JSON.stringify(bookmarks));
      return true;
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      return false;
    }
  }

  // Get bookmarks
  getBookmarks(): string[] {
    try {
      const stored = localStorage.getItem(this.BOOKMARK_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  // Save recent reads
  saveRecentReads(recentReads: string[]): boolean {
    try {
      localStorage.setItem(this.RECENT_READS_KEY, JSON.stringify(recentReads));
      return true;
    } catch (error) {
      console.error('Error saving recent reads:', error);
      return false;
    }
  }

  // Get recent reads
  getRecentReads(): string[] {
    try {
      const stored = localStorage.getItem(this.RECENT_READS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting recent reads:', error);
      return [];
    }
  }

  // Save user settings
  saveSettings(settings: Record<string, any>): boolean {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Get user settings
  getSettings(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Clear all app data
  clearAllData(): boolean {
    try {
      const keysToDelete: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('idarah_')) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('idarah_')) {
          const value = localStorage.getItem(key);
          used += (key.length + (value?.length || 0)) * 2; // UTF-16 encoding
        }
      }
      
      const available = 5 * 1024 * 1024; // 5MB typical limit
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export const localStorageService = new LocalStorageService();

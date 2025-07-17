// Enhanced Notification Service with Real-time Updates
import { supabase } from '../lib/supabase';
import { errorHandler } from './errorHandler';
import type { ApiResponse } from '../types';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  title_arabic?: string;
  message: string;
  message_arabic?: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  read_at?: string;
  action_text?: string;
  action_url?: string;
  scheduled_for?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  type: string;
  title: string;
  title_arabic?: string;
  message: string;
  message_arabic?: string;
  priority: Notification['priority'];
  action_text?: string;
  action_url?: string;
}

export type NotificationResponse = ApiResponse<Notification | Notification[]>;

class NotificationsService {
  private subscriptions = new Map<string, any>();

  // ============================================================================
  // NOTIFICATION TEMPLATES
  // ============================================================================

  private templates: Record<string, NotificationTemplate> = {
    book_due_soon: {
      type: 'reminder',
      title: 'Book Due Soon',
      title_arabic: 'موعد إرجاع الكتاب قريب',
      message: 'Your borrowed book "{bookTitle}" is due in {daysLeft} days. Please return it on time.',
      message_arabic: 'الكتاب المستعار "{bookTitle}" مطلوب إرجاعه خلال {daysLeft} أيام. يرجى إرجاعه في الوقت المحدد.',
      priority: 'normal',
      action_text: 'View Details',
      action_url: '/borrowing'
    },
    book_overdue: {
      type: 'warning',
      title: 'Book Overdue',
      title_arabic: 'تأخير في إرجاع الكتاب',
      message: 'Your borrowed book "{bookTitle}" is overdue. Please return it immediately to avoid fines.',
      message_arabic: 'الكتاب المستعار "{bookTitle}" متأخر. يرجى إرجاعه فوراً لتجنب الغرامات.',
      priority: 'high',
      action_text: 'Return Book',
      action_url: '/borrowing'
    },
    assignment_due: {
      type: 'reminder',
      title: 'Assignment Due',
      title_arabic: 'موعد تسليم الواجب',
      message: 'Assignment "{assignmentTitle}" is due on {dueDate}. Make sure to submit it on time.',
      message_arabic: 'الواجب "{assignmentTitle}" مطلوب تسليمه في {dueDate}. تأكد من تسليمه في الوقت المحدد.',
      priority: 'normal',
      action_text: 'Submit Assignment',
      action_url: '/assignments'
    },
    quiz_available: {
      type: 'info',
      title: 'New Quiz Available',
      title_arabic: 'اختبار جديد متاح',
      message: 'A new quiz "{quizTitle}" is now available for course "{courseTitle}".',
      message_arabic: 'اختبار جديد "{quizTitle}" متاح الآن لمادة "{courseTitle}".',
      priority: 'normal',
      action_text: 'Take Quiz',
      action_url: '/quizzes'
    },
    course_enrollment: {
      type: 'success',
      title: 'Course Enrollment Confirmed',
      title_arabic: 'تأكيد التسجيل في المادة',
      message: 'You have been successfully enrolled in "{courseTitle}". Classes start on {startDate}.',
      message_arabic: 'تم تسجيلك بنجاح في مادة "{courseTitle}". تبدأ الدروس في {startDate}.',
      priority: 'normal',
      action_text: 'View Course',
      action_url: '/courses'
    },
    fine_issued: {
      type: 'warning',
      title: 'Fine Issued',
      title_arabic: 'إصدار غرامة',
      message: 'A fine of {amount} has been issued for "{reason}". Please pay it at your earliest convenience.',
      message_arabic: 'تم إصدار غرامة بقيمة {amount} بسبب "{reason}". يرجى دفعها في أقرب وقت ممكن.',
      priority: 'high',
      action_text: 'Pay Fine',
      action_url: '/fines'
    }
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  // Get notifications for user
  async getNotifications(
    userId: string,
    filters?: {
      isRead?: boolean;
      type?: string;
      priority?: string;
      limit?: number;
    }
  ): Promise<NotificationResponse> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      query = query
        .order('created_at', { ascending: false })
        .limit(filters?.limit || 50);

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Create notification
  async createNotification(notification: Partial<Notification>): Promise<NotificationResponse> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Create notification from template
  async createFromTemplate(
    templateKey: string,
    userId: string,
    variables: Record<string, string>,
    options?: {
      relatedEntityType?: string;
      relatedEntityId?: string;
      scheduledFor?: string;
      expiresAt?: string;
    }
  ): Promise<NotificationResponse> {
    try {
      const template = this.templates[templateKey];
      if (!template) {
        return { data: null, error: `Template '${templateKey}' not found` };
      }

      // Replace variables in template
      let title = template.title;
      let titleArabic = template.title_arabic;
      let message = template.message;
      let messageArabic = template.message_arabic;
      let actionUrl = template.action_url;

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        title = title.replace(new RegExp(placeholder, 'g'), value);
        titleArabic = titleArabic?.replace(new RegExp(placeholder, 'g'), value);
        message = message.replace(new RegExp(placeholder, 'g'), value);
        messageArabic = messageArabic?.replace(new RegExp(placeholder, 'g'), value);
        actionUrl = actionUrl?.replace(new RegExp(placeholder, 'g'), value);
      });

      const notification: Partial<Notification> = {
        user_id: userId,
        title,
        title_arabic: titleArabic,
        message,
        message_arabic: messageArabic,
        type: template.type as Notification['type'],
        priority: template.priority,
        action_text: template.action_text,
        action_url: actionUrl,
        related_entity_type: options?.relatedEntityType,
        related_entity_id: options?.relatedEntityId,
        scheduled_for: options?.scheduledFor,
        expires_at: options?.expiresAt,
        is_read: false
      };

      return this.createNotification(notification);
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<NotificationResponse> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================

  // Subscribe to user notifications
  subscribeToUserNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): () => void {
    const subscription = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('📧 [NOTIFICATIONS] New notification received:', payload.new);
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    const unsubscribe = () => {
      subscription.unsubscribe();
      this.subscriptions.delete(userId);
    };

    this.subscriptions.set(userId, unsubscribe);
    return unsubscribe;
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  // Send notification to multiple users
  async sendBulkNotification(
    userIds: string[],
    notification: Partial<Notification>
  ): Promise<NotificationResponse> {
    try {
      const notifications = userIds.map(userId => ({
        ...notification,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // AUTOMATED NOTIFICATIONS
  // ============================================================================

  // Check for due books and send reminders
  async sendBookDueReminders(): Promise<void> {
    try {
      const { data: dueSoon, error } = await supabase
        .from('borrowing_records')
        .select(`
          id,
          user_id,
          due_date,
          book:books(title, title_arabic),
          user:profiles(id, full_name, preferred_language)
        `)
        .eq('status', 'active')
        .gte('due_date', new Date().toISOString())
        .lte('due_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()); // 3 days

      if (error || !dueSoon) return;

      for (const record of dueSoon) {
        const daysLeft = Math.ceil(
          (new Date(record.due_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );

        await this.createFromTemplate(
          'book_due_soon',
          record.user_id,
          {
            bookTitle: record.book.title,
            daysLeft: daysLeft.toString()
          },
          {
            relatedEntityType: 'borrowing_record',
            relatedEntityId: record.id
          }
        );
      }
    } catch (error) {
      console.error('Error sending book due reminders:', error);
    }
  }

  // Cleanup expired notifications
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error cleaning up expired notifications:', error);
      }
    } catch (error) {
      console.error('Error in cleanupExpiredNotifications:', error);
    }
  }

  // Cleanup subscriptions
  cleanup(): void {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  }
}

export const notificationsService = new NotificationsService();

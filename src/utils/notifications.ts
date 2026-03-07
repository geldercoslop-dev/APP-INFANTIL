// Sistema de notificações para o Kids Mission App

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  onClick?: () => void;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  icon?: string;
  tag?: string;
  repeat?: 'daily' | 'weekly' | 'monthly';
}

class NotificationManager {
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();

  constructor() {
    this.init();
  }

  private init(): void {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return;
    }

    // Request permission on init
    this.requestPermission();

    // Restore scheduled notifications from localStorage
    this.restoreScheduledNotifications();

    // Set up interval to check for scheduled notifications
    setInterval(() => {
      this.checkScheduledNotifications();
    }, 60000); // Check every minute
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return 'denied';
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  public isPermissionGranted(): boolean {
    return Notification.permission === 'granted';
  }

  public showNotification(options: NotificationOptions): void {
    if (!this.isSupported()) {
      console.warn('Notificações não são suportadas neste navegador');
      return;
    }

    if (!this.isPermissionGranted()) {
      console.warn('Permissão de notificação não concedida');
      return;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false
    });

    if (options.onClick) {
      notification.onclick = () => {
        options.onClick?.();
        notification.close();
      };
    }

    // Auto-close after 5 seconds if not requiring interaction
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  public scheduleDailyReminder(title: string, body: string, time: string, icon?: string): string {
    const id = `daily-${Date.now()}`;
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const notification: ScheduledNotification = {
      id,
      title,
      body,
      scheduledTime,
      icon,
      repeat: 'daily'
    };

    this.scheduledNotifications.set(id, notification);
    this.saveScheduledNotifications();
    
    return id;
  }

  public scheduleMissionReminder(missionTitle: string, time: string): string {
    const id = `mission-${Date.now()}`;
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const notification: ScheduledNotification = {
      id,
      title: '⏰ Lembrete de Missão',
      body: `Não se esqueça: ${missionTitle}`,
      scheduledTime,
      icon: '/favicon.ico',
      repeat: 'daily'
    };

    this.scheduledNotifications.set(id, notification);
    this.saveScheduledNotifications();
    
    return id;
  }

  public cancelScheduledNotification(id: string): void {
    this.scheduledNotifications.delete(id);
    this.saveScheduledNotifications();
  }

  public getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  private checkScheduledNotifications(): void {
    const now = new Date();
    
    for (const [id, notification] of this.scheduledNotifications) {
      if (notification.scheduledTime <= now) {
        this.showNotification({
          title: notification.title,
          body: notification.body,
          icon: notification.icon,
          tag: notification.tag || id
        });

        // Reschedule if it's a repeating notification
        if (notification.repeat) {
          this.rescheduleNotification(notification);
        } else {
          this.scheduledNotifications.delete(id);
        }
      }
    }
    
    this.saveScheduledNotifications();
  }

  private rescheduleNotification(notification: ScheduledNotification): void {
    const newScheduledTime = new Date(notification.scheduledTime);
    
    switch (notification.repeat) {
      case 'daily':
        newScheduledTime.setDate(newScheduledTime.getDate() + 1);
        break;
      case 'weekly':
        newScheduledTime.setDate(newScheduledTime.getDate() + 7);
        break;
      case 'monthly':
        newScheduledTime.setMonth(newScheduledTime.getMonth() + 1);
        break;
    }

    const updatedNotification = {
      ...notification,
      scheduledTime: newScheduledTime
    };

    this.scheduledNotifications.set(notification.id, updatedNotification);
  }

  private saveScheduledNotifications(): void {
    try {
      const data = Array.from(this.scheduledNotifications.values());
      localStorage.setItem('scheduledNotifications', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar notificações agendadas:', error);
    }
  }

  private restoreScheduledNotifications(): void {
    try {
      const data = localStorage.getItem('scheduledNotifications');
      if (data) {
        const notifications: ScheduledNotification[] = JSON.parse(data);
        notifications.forEach(notification => {
          // Convert string dates back to Date objects
          notification.scheduledTime = new Date(notification.scheduledTime);
          this.scheduledNotifications.set(notification.id, notification);
        });
      }
    } catch (error) {
      console.error('Erro ao restaurar notificações agendadas:', error);
    }
  }
}

// Singleton instance
export const notificationManager = new NotificationManager();

// Helper functions for easy access
export const requestNotificationPermission = (): Promise<NotificationPermission> => {
  return notificationManager.requestPermission();
};

export const scheduleDailyReminder = (title: string, body: string, time: string, icon?: string): string => {
  return notificationManager.scheduleDailyReminder(title, body, time, icon);
};

export const scheduleMissionReminder = (missionTitle: string, time: string): string => {
  return notificationManager.scheduleMissionReminder(missionTitle, time);
};

export const showNotification = (options: NotificationOptions): void => {
  notificationManager.showNotification(options);
};

export const isNotificationSupported = (): boolean => {
  return notificationManager.isSupported();
};

export const isNotificationPermissionGranted = (): boolean => {
  return notificationManager.isPermissionGranted();
};

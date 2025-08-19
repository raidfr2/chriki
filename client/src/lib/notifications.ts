// Notification utility functions

export interface NotificationSettings {
  desktopNotifications: boolean;
  soundNotifications: boolean;
}

export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const saved = localStorage.getItem('chriki-notifications');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading notification settings:', error);
  }
  
  return {
    desktopNotifications: false,
    soundNotifications: false
  };
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem('chriki-notifications', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
  const settings = loadNotificationSettings();
  
  if (!settings.desktopNotifications) {
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

export const playNotificationSound = (): void => {
  const settings = loadNotificationSettings();
  
  if (!settings.soundNotifications) {
    return;
  }

  try {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const showChatNotification = async (message: string): Promise<void> => {
  await showNotification('New message from Chriki', {
    body: message.length > 100 ? message.substring(0, 100) + '...' : message,
    tag: 'chriki-chat',
    renotify: true
  });
  
  playNotificationSound();
};

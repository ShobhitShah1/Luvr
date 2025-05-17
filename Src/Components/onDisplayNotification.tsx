import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { addNotification } from '../Redux/Action/actions';
import { store } from '../Redux/Store/store';

export async function onDisplayNotification(title: string, body: string): Promise<void> {
  try {
    const permissionStatus = await notifee.requestPermission();
    if (!permissionStatus) {
      throw new Error('Notification permission denied');
    }

    const channelId = await notifee.createChannel({
      id: 'General',
      name: 'General Notification',
      bypassDnd: true,
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    if (!channelId) {
      throw new Error('Failed to create notification channel');
    }

    await notifee.displayNotification({
      title: title || '',
      body: body || '',
      android: { channelId },
    });

    if (store) {
      store.dispatch(
        addNotification({
          title,
          description: body,
          date: new Date(),
        })
      );
    }
  } catch (error) {
    console.error('Error displaying notification:', error);
    throw error;
  }
}

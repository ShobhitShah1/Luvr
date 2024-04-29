import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import {addNotification} from '../Redux/Action/userActions';
import {store} from '../Redux/Store/store';

export async function onDisplayNotification(title: string, body: string) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'General',
    name: 'General Notification',
    bypassDnd: true,
    visibility: AndroidVisibility.PUBLIC,
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
    },
  });

  if (store) {
    store.dispatch(
      addNotification({title, description: body, date: new Date()}),
    );
  }
}

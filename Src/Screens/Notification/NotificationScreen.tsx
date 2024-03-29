import React from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import RenderNotificationView from './Components/RenderNotificationView';
import styles from './styles';

const NotificationScreen = () => {
  const notifications = useSelector((state: any) => state.user.notifications);

  // Reverse the array of notifications to display the newest ones first
  const reversedNotifications = notifications.slice().reverse();

  return (
    <View style={styles.container}>
      <ProfileAndSettingHeader
        Title={'Notification'}
        onUpdatePress={() => {
          // UpdateSetting();
        }}
      />
      <View style={styles.NotificationViewContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          updateCellsBatchingPeriod={20}
          maxToRenderPerBatch={20}
          data={reversedNotifications}
          renderItem={({item}) => (
            <RenderNotificationView
              date={item.date}
              description={item.description}
              title={item.title}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;

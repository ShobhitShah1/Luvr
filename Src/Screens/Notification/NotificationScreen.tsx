/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import CommonImages from '../../Common/CommonImages';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import RenderNotificationView from './Components/RenderNotificationView';
import styles from './styles';

const RenderEmptyComponent = () => {
  return (
    <View style={styles.EmptyListView}>
      <View style={styles.NoChatIconBackground}>
        <Image source={CommonImages.NoNotification} style={styles.NoChatIcon} />
      </View>
      <Text style={styles.NoChatText}>No notification</Text>
      <Text style={styles.NoChatDescription}>
        There are no notification yet. Please come back here to get notification
        about likes, matches, messages and much more!
      </Text>
    </View>
  );
};

const NotificationScreen = () => {
  const notifications = useSelector((state: any) => state.user.notifications);

  const reversedNotifications =
    notifications?.length !== 0 ? notifications?.slice()?.reverse() : [];

  return (
    <View style={styles.container}>
      <ProfileAndSettingHeader Title={'Notification'} />
      <View style={styles.NotificationViewContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          updateCellsBatchingPeriod={20}
          contentContainerStyle={{
            flex:
              reversedNotifications?.length === 0 || !reversedNotifications
                ? 1
                : 0,
          }}
          maxToRenderPerBatch={20}
          data={reversedNotifications}
          renderItem={({item}) => (
            <RenderNotificationView
              date={item.date}
              description={item.description}
              title={item.title}
            />
          )}
          ListEmptyComponent={<RenderEmptyComponent />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import RenderNotificationView from './Components/RenderNotificationView';
import styles from './styles';
import CommonImages from '../../Common/CommonImages';
import {recognizePrefixSuffix} from 'react-native-reanimated/lib/typescript/reanimated2/animation/util';

const NotificationScreen = () => {
  const notifications = useSelector((state: any) => state.user.notifications);

  // Reverse the array of notifications to display the newest ones first
  const reversedNotifications = notifications.slice().reverse();

  const RenderEmptyComponent = () => {
    return (
      <View style={styles.EmptyListView}>
        <View style={styles.NoChatIconBackground}>
          <Image
            source={CommonImages.NoNotification}
            style={styles.NoChatIcon}
          />
        </View>
        <Text style={styles.NoChatText}>No notification</Text>
        <Text style={styles.NoChatDescription}>
          There are no notification yet. Please come back here to get
          notification about likes, matches, messages and much more!
        </Text>
      </View>
    );
  };

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

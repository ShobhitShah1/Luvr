/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CommonImages from '../../Common/CommonImages';
import GradientView from '../../Common/GradientView';
import { useTheme } from '../../Contexts/ThemeContext';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import RenderNotificationView from './Components/RenderNotificationView';
import styles from './styles';
import CommonIcons from '../../Common/CommonIcons';
import LinearGradient from 'react-native-linear-gradient';

const NotificationScreen = () => {
  const { colors, isDark } = useTheme();
  const notifications = useSelector((state: any) => state.user.notifications);
  const reversedNotifications = notifications?.length !== 0 ? notifications?.slice()?.reverse() : [];

  return (
    <GradientView>
      <View style={styles.container}>
        <ProfileAndSettingHeader Title={'Notification'} />
        <View style={styles.NotificationViewContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            updateCellsBatchingPeriod={20}
            contentContainerStyle={{
              flex: reversedNotifications?.length === 0 || !reversedNotifications ? 1 : 0,
            }}
            maxToRenderPerBatch={20}
            data={reversedNotifications}
            renderItem={({ item }) => (
              <RenderNotificationView date={item.date} description={item.description} title={item.title} />
            )}
            ListEmptyComponent={
              <View style={styles.EmptyListView}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
                  style={styles.NoChatIconBackground}
                >
                  <Image
                    tintColor={isDark ? colors.White : undefined}
                    source={CommonIcons.ic_noNotification}
                    style={styles.NoChatIcon}
                  />
                </LinearGradient>
                <Text style={[styles.NoChatText, { color: colors.TitleText }]}>No notification</Text>
                <Text style={[styles.NoChatDescription, { color: colors.TextColor }]}>
                  There are no notification yet. Please come back here to get notification about likes, matches,
                  messages and much more!
                </Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </GradientView>
  );
};

export default memo(NotificationScreen);

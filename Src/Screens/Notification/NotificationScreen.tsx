import React from 'react';
import {FlatList, View} from 'react-native';
import {APP_NAME, DummyImage} from '../../Config/Setting';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import RenderNotificationView from './Components/RenderNotificationView';
import styles from './styles';

const data = [
  {
    id: 0,
    image: DummyImage,
    title: APP_NAME,
    description:
      'Add more pics & complete your bio to get the most from your experience.',
    time: new Date(),
  },
];

const NotificationScreen = () => {
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
          data={data}
          renderItem={({item}) => {
            return (
              <RenderNotificationView
                image={item.image}
                time={item.time}
                description={item.description}
                id={item.id}
                title={item.title}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;

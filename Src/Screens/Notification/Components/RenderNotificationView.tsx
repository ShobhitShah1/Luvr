import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {COLORS} from '../../../Common/Theme';

interface NotificationData {
  id: number;
  image: string;
  title: string;
  description: string;
  time: string | object;
}

const RenderNotificationView: FC<NotificationData> = ({
  id,
  image,
  title,
  description,
  time,
}) => {
  console.log('image', image);
  return (
    <View style={styles.Container}>
      <View>
        <Image source={{uri: image}} />
      </View>
    </View>
  );
};

export default RenderNotificationView;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    marginVertical: 10,
    backgroundColor: COLORS.White,
  },
});

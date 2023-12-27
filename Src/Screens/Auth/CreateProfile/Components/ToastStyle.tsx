/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS, GROUP_FONT} from '../../../../Common/Theme';

const ToastStyle = ({status, title, message}: any) => {
  console.log('status', status);
  return (
    <View
      style={[
        styles.Container,
        {
          borderLeftColor: status === 'success' ? 'green' : 'red',
        },
      ]}>
      <View>
        {title === null ? (
          <Text style={styles.MessageText}>{message}</Text>
        ) : (
          <View>
            <Text style={styles.TitleText}>{title}</Text>
            <Text style={styles.Message}>{message}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ToastStyle;

const styles = StyleSheet.create({
  Container: {
    width: '85%',
    paddingVertical: 10,
    backgroundColor: COLORS.White,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  MessageText: {
    marginVertical: 5,
    ...GROUP_FONT.body3,
    color: COLORS.Black,
  },
  TitleText: {
    ...GROUP_FONT.h3,
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  Message: {
    ...GROUP_FONT.body4,
    color: COLORS.Gray,
    fontFamily: FONTS.Medium,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONTS, GROUP_FONT } from '../../../../Common/Theme';

function ToastStyle({ status, title, message }: any) {
  return (
    <View style={[styles.Container, { borderLeftColor: status === 'success' ? 'green' : 'red' }]}>
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
}

export default ToastStyle;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: COLORS.White,
    borderLeftWidth: 10,
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '85%',
  },
  Message: {
    ...GROUP_FONT.body4,
    color: COLORS.Gray,
    fontFamily: FONTS.Medium,
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
});

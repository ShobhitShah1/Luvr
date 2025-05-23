import React, { memo } from 'react';
import { Bubble } from 'react-native-gifted-chat';
import type { BubbleProps, IMessage } from 'react-native-gifted-chat';

import { FONTS } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

const ChatBubble: React.FC<BubbleProps<IMessage>> = props => {
  const { colors, isDark } = useTheme();

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          padding: 3,
          paddingHorizontal: 10,
          marginVertical: 5,
          marginHorizontal: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 20,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White,
        },
        left: {
          padding: 3,
          paddingHorizontal: 10,
          marginVertical: 5,
          marginHorizontal: 10,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 20,
          backgroundColor: colors.Primary,
        },
      }}
      textStyle={{
        right: {
          lineHeight: 25,
          fontSize: 14.2,
          color: isDark ? colors.White : colors.Black,
          fontFamily: FONTS.Medium,
        },
        left: {
          lineHeight: 25,
          fontSize: 14.2,
          color: colors.White,
          fontFamily: FONTS.Medium,
        },
      }}
      bottomContainerStyle={{
        right: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 20,
        },
        left: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 20,
        },
      }}
      containerToPreviousStyle={{
        right: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 20,
        },
        left: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 20,
        },
      }}
      containerToNextStyle={{
        right: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 20,
        },
        left: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 20,
        },
      }}
      containerStyle={{
        right: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 20,
        },
        left: {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 20,
        },
      }}
    />
  );
};

export default memo(ChatBubble);

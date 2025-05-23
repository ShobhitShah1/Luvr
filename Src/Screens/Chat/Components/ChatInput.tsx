import React, { memo } from 'react';
import { View, Image, Text } from 'react-native';
import { Composer, InputToolbar, Send } from 'react-native-gifted-chat';
import type { InputToolbarProps, SendProps, IMessage } from 'react-native-gifted-chat';

import CommonIcons from '../../../Common/CommonIcons';
import { FONTS } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

interface ChatInputProps {
  inputToolbarProps: InputToolbarProps<IMessage>;
  canSendMessage: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputToolbarProps, canSendMessage }) => {
  const { colors, isDark } = useTheme();

  const renderComposer = (composerProps: any) => (
    <View
      style={{
        height: 59,
        width: '90%',
        overflow: 'hidden',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.3))' : colors.White,
        borderRadius: 25,
        marginRight: 5,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 5,
        borderWidth: 0.5,
        borderColor: isDark ? colors.White : 'transparent',
        opacity: canSendMessage ? 1 : 0.5,
      }}
    >
      <View style={{ width: '88%', alignSelf: 'flex-start', top: 2.5, justifyContent: 'center' }}>
        <Composer
          {...composerProps}
          textInputStyle={{
            color: colors.TextColor,
            backgroundColor: 'transparent',
            marginLeft: 0,
            fontSize: 14,
            flex: 1,
            fontFamily: FONTS.Medium,
          }}
          textInputProps={{
            textAlignVertical: 'center',
            verticalAlign: 'center',
          }}
          composerHeight={59}
          placeholder={
            canSendMessage ? 'Write your message here' : 'Wait for a message or upgrade to Gold'
          }
          placeholderTextColor={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(130, 130, 130, 1)'}
          editable={canSendMessage}
        />
      </View>
    </View>
  );

  const renderSendButton = (props: SendProps<IMessage>) => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        right: 15,
        zIndex: 9999,
        opacity: canSendMessage ? 1 : 0.5,
      }}
    >
      <View
        style={{
          width: 35,
          height: 35,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={CommonIcons.ic_send_message}
          style={{
            width: 22,
            height: 22,
            tintColor: isDark ? colors.White : 'rgba(130, 130, 130, 1)',
          }}
        />
      </View>
    </Send>
  );

  return (
    <InputToolbar
      {...inputToolbarProps}
      containerStyle={{
        marginVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 8,
        left: 8,
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      }}
      primaryStyle={{
        alignSelf: 'center',
        alignItems: 'center',
      }}
      renderComposer={renderComposer}
      renderSend={renderSendButton}
    />
  );
};

export default memo(ChatInput);

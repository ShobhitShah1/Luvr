import React, { memo, useEffect, useState } from 'react';
import { Image, Keyboard, Platform, View } from 'react-native';
import { Composer, IMessage, InputToolbar, InputToolbarProps, Send, SendProps } from 'react-native-gifted-chat';
import CommonIcons from '../../../Common/CommonIcons';
import { FONTS } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

interface ChatInputProps {
  inputToolbarProps: InputToolbarProps<IMessage>;
  canSendMessage: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputToolbarProps, canSendMessage }) => {
  const { colors, isDark } = useTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const renderComposer = (composerProps: any) => (
    <View
      style={{
        top: Platform.OS === 'ios' ? (keyboardVisible ? -70 : 0) : undefined,
        height: 59,
        width: '93%',
        marginRight: 5,
        borderRadius: 25,
        paddingBottom: 5,
        borderWidth: 0.5,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignContent: 'center',
        opacity: canSendMessage ? 1 : 0.5,
        borderColor: isDark ? colors.White : 'transparent',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.3))' : colors.White,
      }}
    >
      <View
        style={{
          width: '88%',
          alignSelf: 'flex-start',
          top: 2.5,
          justifyContent: 'center',
        }}
      >
        <Composer
          {...composerProps}
          textInputStyle={{
            color: colors.TextColor,
            backgroundColor: 'transparent',
            marginLeft: 0,
            fontSize: 14,
            fontFamily: FONTS.Medium,
            ...(Platform.OS === 'ios' && {
              height: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              textAlignVertical: 'center',
              paddingTop: 13,
            }),
          }}
          textInputProps={{
            textAlignVertical: 'center',
            verticalAlign: 'center',
          }}
          // composerHeight={59}
          placeholder={canSendMessage ? 'Write your message here' : 'Wait for a message or upgrade to Gold'}
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
        top: Platform.OS === 'ios' ? (keyboardVisible ? -70 : 0) : 0,
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
          style={{ width: 22, height: 22, tintColor: isDark ? colors.White : 'rgba(130, 130, 130, 1)' }}
        />
      </View>
    </Send>
  );

  return (
    <InputToolbar
      {...inputToolbarProps}
      containerStyle={{
        left: 8,
        paddingHorizontal: 5,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        marginBottom: Platform.OS === 'ios' ? 0 : 5,
      }}
      primaryStyle={{
        alignSelf: 'center',
        alignItems: 'center',
      }}
      accessoryStyle={{
        backgroundColor: 'red',
      }}
      renderComposer={renderComposer}
      renderSend={renderSendButton}
    />
  );
};

export default memo(ChatInput);

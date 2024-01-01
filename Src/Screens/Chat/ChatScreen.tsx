import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../Common/Theme';
import ChatScreenHeader from './Components/ChatScreenHeader';

const ChatScreen = () => {
  return (
    <View style={styles.Container}>
      <ChatScreenHeader />
      <StatusBar backgroundColor={COLORS.White} barStyle={'dark-content'} />
      <Text>ChatScreen</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
});

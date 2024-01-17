/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import CommonImages from '../../Common/CommonImages';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import {chatRoomData} from '../../Components/Data/ChatRoomData';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import RenderChatRoomList from './Components/RenderChatRoomList';

const ChatRoomScreen = () => {
  const ListEmptyView = () => {
    return (
      <View style={styles.EmptyListView}>
        <View style={styles.NoChatIconBackground}>
          <Image source={CommonImages.NoChat} style={styles.NoChatIcon} />
        </View>
        <Text style={styles.NoChatText}>No chats, Get swiping</Text>
        <Text style={styles.NoChatDescription}>
          When you match with other peoples they’ll appear here, where you can
          send them a message.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

      <View style={styles.ListChatView}>
        <FlatList
          data={chatRoomData}
          contentContainerStyle={{
            flex: chatRoomData.length === 0 ? 1 : 0,
            justifyContent: chatRoomData.length === 0 ? 'center' : undefined,
          }}
          maxToRenderPerBatch={10}
          renderItem={({item, index}) => {
            return <RenderChatRoomList item={item} index={index} />;
          }}
          ListEmptyComponent={<ListEmptyView />}
        />
      </View>
    </View>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  ListChatView: {
    flex: 1,
    marginTop: 10,
  },
  EmptyListView: {
    // flex: 1,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  NoChatIconBackground: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  NoChatIcon: {
    width: 90,
    height: 90,
    alignSelf: 'center',
  },
  NoChatText: {
    ...GROUP_FONT.h1,
    fontSize: 27,
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.Primary,
  },
  NoChatDescription: {
    marginTop: 8,
    width: '85%',
    ...GROUP_FONT.body4,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
  },
});

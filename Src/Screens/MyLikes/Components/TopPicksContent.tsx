import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';

interface TopLikeData {
  TopPickData: [];
}

const TopPicksContent: FC<TopLikeData> = ({TopPickData}) => {
  return (
    <View>
      <Text>TopPicksContent</Text>
    </View>
  );
};

export default TopPicksContent;

const styles = StyleSheet.create({});

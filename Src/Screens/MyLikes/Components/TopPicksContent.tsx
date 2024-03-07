import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import CategoryRenderCard from '../../Home/ExploreCards/Components/CategoryRenderCard';
import {FakeProfileData, FakeUserCard} from '../../../Components/Data';
import {ProfileType} from '../../../Types/ProfileType';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';

interface TopLikeData {
  TopPickData: [];
}

const TopPicksContent: FC<TopLikeData> = ({TopPickData}) => {
  return (
    <View style={styles.Container}>
      <Text
        style={{...GROUP_FONT.h2, color: COLORS.Primary, textAlign: 'center'}}>
        Noting to display here
      </Text>
      {/* <CategoryRenderCard
        item={TopPickData}
        index={1}
        isRecentlyActive={true}
      /> */}
    </View>
  );
};

export default TopPicksContent;

const styles = StyleSheet.create({
  Container: {
    // flex: 0.1,
    paddingVertical: 50,
    // justifyContent: 'center',
  },
});

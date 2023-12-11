import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../../Common/Theme';
import DetailCardHeader from './Components/DetailCardHeader';

const ExploreCardDetailScreen = () => {
  return (
    <View style={styles.Container}>
      <DetailCardHeader />
    </View>
  );
};

export default ExploreCardDetailScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
});

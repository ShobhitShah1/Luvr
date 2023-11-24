import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {COLORS} from '../../Common/Theme';

const ExploreCard: FC = () => {
  return (
    <View style={styles.Container}>
      <View style={styles.CardContainerView}>
        <Text style={styles.TitleText}>Explore New Matches</Text>
      </View>
    </View>
  );
};

export default ExploreCard;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
});

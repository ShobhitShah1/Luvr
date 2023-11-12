import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import WhatElseExtraData from '../../../Components/Data/WhatElseExtraData';
import CreateProfileHeader from './CreateProfileHeader';
import CreateProfileStyles from './styles';

const YourIntro: FC = () => {
  let ProgressCount: number = 0.9;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );
  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={true} />
      <View style={[styles.ContentView]}>
        <Text style={CreateProfileStyles.TitleText}>What are you into?</Text>
        <Text style={styles.HabitsMatchText}>
          You like what you like. Now, let everyone know.
        </Text>
      </View>

      <View style={{height: '70%'}}>
        {/* <FlatList
          data={WhatElseExtraData}
          renderItem={renderItem}
          style={{height: '100%'}}
          initialNumToRender={20}
          nestedScrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews={true}
          // getItemLayout={(_, index) => ({
          //   length: ITEM_HEIGHT,
          //   offset: ITEM_HEIGHT * index,
          //   index,
          // })}
        /> */}
      </View>

      {/* Missing Category To Track On Letter */}

      {/* <View style={styles.checkMissingCategories}>
        <Text style={styles.missingCategoriesText}>
          {`Missing Categories: ${isCategoryMissing().join(', ')}`}
        </Text>
      </View> */}

      <View style={[styles.BottomButtonWidth]}>
        <View style={styles.ButtonContainer}>
          <GradientButton
            Title={`Next ${selectedItems?.length || 0}/5`}
            Disabled={false}
            Navigation={() => {
              navigation.navigate('LoginStack', {
                screen: 'AddRecentPics',
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default YourIntro;

const styles = StyleSheet.create({
  ContentView: {
    overflow: 'hidden',
    maxWidth: '100%',
    marginVertical: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    paddingHorizontal: hp('1.9%'),
    backgroundColor: COLORS.White,
    width: '100%',
  },
  HabitsMatchText: {
    ...GROUP_FONT.h3,
    marginTop: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  ButtonContainer: {
    width: '90%',
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  BottomButtonWidth: {
    width: '100%',
    bottom: hp('1.5%'),
    position: 'absolute',
    paddingTop: hp('1.5%'),
    borderTopWidth: hp('0.07%'),
    borderTopColor: COLORS.Placeholder,
  },
});

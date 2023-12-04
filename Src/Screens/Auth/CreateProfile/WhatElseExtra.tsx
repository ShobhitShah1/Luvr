/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import WhatElseExtraData from '../../../Components/Data/WhatElseExtraData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

interface HabitItemProps {
  habit: {id: number; habit: string; options: string[]};
  selectedOption?: string;
  onPress: (habitId: number, option: string) => void;
}

const WhatElseExtra: FC = () => {
  let ProgressCount: number = 0.8;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );
  const HabitItem: FC<HabitItemProps> = React.memo(
    ({habit, selectedOption, onPress}) => {
      return (
        <React.Fragment>
          <View key={habit.id} style={[styles.habitContainer]}>
            <Text style={styles.habitTitle}>{habit.habit}</Text>
            <View style={{}}>
              <FlatList
                data={habit.options}
                numColumns={3}
                renderItem={({item, index}: any) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        selectedOption === item && styles.selectedOption,
                      ]}
                      onPress={() => onPress(habit.id, item)}>
                      <Text
                        style={[
                          styles.CategoriesText,
                          selectedOption === item &&
                            styles.SelectedCategoriesText,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </React.Fragment>
      );
    },
  );
  const handleOptionPress = useCallback((habitId: number, option: string) => {
    setSelectedItems(prevSelection => ({
      ...prevSelection,
      [habitId.toString()]: option,
    }));
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {id: number; habit: string; options: string[]};
  }) => (
    <HabitItem
      habit={item}
      selectedOption={selectedItems[item.id.toString()]}
      onPress={handleOptionPress}
    />
  );

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={7} Skip={true} />
      <View style={styles.DataViewContainer}>
        <View style={[styles.ContentView]}>
          <Text style={styles.TitleText}>What's about {'\n'}you?</Text>
          <Text style={styles.AboutYouDescription}>
            Say something about yourself. so you can match with your magical
            person
          </Text>
        </View>

        <View style={[styles.FlatListContainerView]}>
          <FlatList
            data={WhatElseExtraData}
            renderItem={renderItem}
            style={styles.FlatListStyle}
            initialNumToRender={20}
            nestedScrollEnabled={false}
            keyExtractor={item => item.id.toString()}
            removeClippedSubviews={true}
          />
        </View>

        {/* Missing Category To Track On Letter */}

        {/* <View style={styles.checkMissingCategories}>
        <Text style={styles.missingCategoriesText}>
          {`Missing Categories: ${isCategoryMissing().join(', ')}`}
        </Text>
      </View> */}
      </View>

      <View style={[CreateProfileStyles.BottomButton]}>
        <GradientButton
          Title={'Continue'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'YourIntro',
            });
          }}
        />
      </View>
    </View>
  );
};

export default WhatElseExtra;

const styles = StyleSheet.create({
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  AboutYouDescription: {
    ...GROUP_FONT.h3,
    marginTop: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  optionsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  ContentView: {
    overflow: 'hidden',
    maxWidth: '100%',
    paddingHorizontal: hp('2.8%'),
    width: '100%',
  },

  habitContainer: {
    marginHorizontal: hp('1.9%'),
    marginVertical: hp('0.5%'),
  },
  habitTitle: {
    marginBottom: hp('1%'),
    fontSize: hp('1.8%'),
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  optionButton: {
    width: hp('12%'),
    height: hp('6.8%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    // marginHorizontal: hp('1%'),
    marginRight: hp('1.5%'),
    marginVertical: hp('1%'),
    backgroundColor: COLORS.White,
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
  },
  CategoriesText: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    ...GROUP_FONT.body5,
    fontSize: hp('1.4%'),
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  SelectedCategoriesText: {
    color: COLORS.White,
  },
  checkMissingCategories: {
    marginTop: 16,
  },
  missingCategoriesText: {
    ...GROUP_FONT.h3,
    color: COLORS.White,
  },
  ButtonContainer: {
    width: '90%',
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    // backgroundColor: COLORS.White,
  },
  BottomButtonWidth: {
    width: '100%',
    bottom: hp('1.5%'),
    position: 'absolute',
    borderTopColor: COLORS.Placeholder,
  },
  FlatListContainerView: {
    height: '72%',
    marginHorizontal: hp('0.8%'),
  },
  FlatListStyle: {
    height: '100%',
    marginTop: hp('2%'),
  },
});

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import LifestyleData from '../../../Components/Data/LifestyleData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const AddLifestyle: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );

  const handleOptionPress = useCallback((habitName: string, option: string) => {
    setSelectedItems(prevSelection => {
      // Copy the previous selection
      const newSelection = {...prevSelection};

      // Check if an option is already selected for this habit
      if (newSelection[habitName.toString()] === option) {
        // If the same option is selected again, unselect it
        delete newSelection[habitName.toString()];
      } else {
        // Set the new selection for the current habit and option
        newSelection[habitName.toString()] = option;

        // Remove other options for the same habit
        LifestyleData.forEach(item => {
          if (item.habit === habitName) {
            item.options.forEach(res => {
              if (res !== option) {
                delete newSelection[`${habitName}_${res}`];
              }
            });
          }
        });
      }

      return newSelection;
    });
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {id: number; habit: string; options: string[]};
  }) => {
    return (
      <View style={styles.HabitsContainerView} key={item.id}>
        <Text style={styles.HabitTitle}>{item.habit}</Text>
        <View style={styles.HabitOptionContainerView}>
          {item.options.map((res, index) => {
            console.log(selectedItems);
            return (
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                onPress={() => handleOptionPress(item.habit, res)}
                style={[
                  styles.HabitOptionView,
                  {
                    backgroundColor:
                      selectedItems[item.habit] === res
                        ? COLORS.Primary
                        : COLORS.White,
                  },
                ]}
                key={index}>
                <Text
                  style={[
                    styles.HabitOptionText,
                    {
                      color:
                        selectedItems[item.habit] === res
                          ? COLORS.White
                          : '#828282',
                    },
                  ]}>
                  {res}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={6} Skip={true} />

      <View style={styles.DataViewContainer}>
        <View style={[styles.ContentView]}>
          <Text style={styles.TitleText}>
            Let’s talk about your daily habits!
          </Text>
          <Text style={styles.HabitsMatchText}>
            Share your daily lifestyle habits that best represent you.
          </Text>
        </View>

        <View style={styles.FlatListView}>
          <FlatList
            data={LifestyleData}
            renderItem={renderItem}
            style={styles.FlatList}
            initialNumToRender={20}
            nestedScrollEnabled={false}
            keyExtractor={item => item.id.toString()}
            removeClippedSubviews={true}
          />
        </View>
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Continue'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'WhatElseExtra',
            });
          }}
        />
      </View>
    </View>
  );
};

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
  HabitsMatchText: {
    ...GROUP_FONT.h3,
    marginTop: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  optionsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  ContentView: {
    paddingHorizontal: hp('2.8%'),
  },

  habitContainer: {
    marginHorizontal: hp('1.9%'),
  },
  BottomLine: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp('0.5%'),
    marginBottom: hp('2%'),
    justifyContent: 'center',
    marginHorizontal: hp('1.9%'),
    borderBottomWidth: hp('0.05%'),
    borderBottomColor: COLORS.Gray,
  },
  habitTitle: {
    ...GROUP_FONT.h3,
  },
  optionButton: {
    borderRadius: hp('2%'),
    marginRight: hp('0.8%'),
    borderWidth: hp('0.09%'),
    borderColor: COLORS.Gray,
    marginVertical: hp('1%'),
    paddingHorizontal: hp('1%'),
    paddingVertical: hp('0.5%'),
    marginHorizontal: hp('0.5%'),
  },
  selectedOption: {
    borderColor: COLORS.Primary,
  },
  CategoriesText: {
    textAlign: 'center',
    ...GROUP_FONT.h4,
    color: COLORS.Gray,
  },
  SelectedCategoriesText: {
    ...GROUP_FONT.h4,
    color: COLORS.Gray,
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
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  BottomButtonWidth: {
    width: '100%',
    position: 'absolute',
    bottom: hp('1.5%'),
    overflow: 'hidden',
    paddingTop: hp('1.5%'),
  },
  OptionScrollViewContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  FlatListView: {
    height: '70%',
  },
  FlatList: {
    height: '100%',
    paddingTop: hp('1%'),
  },
  HabitsContainerView: {
    paddingHorizontal: hp('2.8%'),
    paddingVertical: hp('1.5%'),
  },

  HabitTitle: {
    marginBottom: hp('1.5%'),
    fontSize: hp('1.8%'),
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  HabitOptionContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  HabitOptionView: {
    width: hp('12%'),
    height: hp('6.5%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
  },
  HabitOptionText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
});

export default AddLifestyle;

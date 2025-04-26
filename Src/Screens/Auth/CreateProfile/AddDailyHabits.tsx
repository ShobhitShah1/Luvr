/* eslint-disable react-native/no-inline-styles */
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import { LifestyleData } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const requiredHabits = ['drink', 'exercise', 'movies', 'smoke'];

const AddDailyHabits = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();
  const userData = useSelector((state: any) => state?.user);

  const navigation = useCustomNavigation();
  const [isSendRequestLoading, setIsSendRequestLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    requiredHabits.reduce((acc, habit) => {
      acc[habit] = userData?.[LocalStorageFields[`${habit.charAt(0) + habit.slice(1)}`]] || '';
      return acc;
    }, {})
  );

  useEffect(() => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      ...requiredHabits.reduce((acc, habit) => {
        acc[habit] = userData?.[LocalStorageFields[`${habit.charAt(0) + habit.slice(1)}`]] || '';
        return acc;
      }, {}),
    }));
  }, [userData]);

  const handleOptionPress = useCallback((habitName: string, option: string) => {
    setSelectedItems((prevSelection) => {
      const newSelection = { ...prevSelection };

      if (newSelection[habitName.toString()] === option) {
        delete newSelection[habitName.toString()];
      } else {
        newSelection[habitName.toString()] = option;

        LifestyleData.forEach((item) => {
          if (item.habit === habitName) {
            item.options.forEach((res) => {
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
    item: { id, habit, options, key },
  }: {
    item: { id: number; key: string; habit: string; options: string[] };
  }) => {
    return (
      <View style={styles.HabitsContainerView} key={id}>
        <Text style={[styles.HabitTitle, { color: colors.TitleText }]}>{habit}</Text>

        <View style={styles.HabitOptionContainerView}>
          {options.map((res, index) => {
            const selected = selectedItems[key] === res;

            return (
              <GradientBorderView
                key={index}
                gradientProps={{
                  colors: selected
                    ? isDark
                      ? colors.ButtonGradient
                      : ['transparent', 'transparent']
                    : isDark
                      ? colors.UnselectedGradient
                      : ['transparent', 'transparent'],
                }}
                style={[
                  styles.HabitOptionView,
                  {
                    backgroundColor: isDark ? 'transparent' : selected ? colors.Primary : colors.White,
                    borderWidth: selected ? 2 : 0.5,
                  },
                ]}
              >
                <Pressable style={{ flex: 1, justifyContent: 'center' }} onPress={() => handleOptionPress(key, res)}>
                  <Text
                    style={[
                      styles.HabitOptionText,
                      {
                        color: selected ? colors.White : colors.TextColor,
                      },
                    ]}
                  >
                    {res}
                  </Text>
                </Pressable>
              </GradientBorderView>
            );
          })}
        </View>
      </View>
    );
  };

  const onPressNext = async () => {
    setIsSendRequestLoading(true);

    try {
      const allHabitsSelected = requiredHabits.every((habit) => selectedItems.hasOwnProperty(habit));

      if (allHabitsSelected) {
        await Promise.all([
          requiredHabits.forEach((habit) => {
            dispatch(
              updateField(
                LocalStorageFields[`${habit.charAt(0) + habit.slice(1)}` as keyof typeof LocalStorageFields],
                selectedItems[habit]
              )
            );
          }),
        ]);

        setTimeout(() => {
          navigation.navigate('LoginStack', {
            screen: 'WhatAboutYou',
          });
        }, 200);
      } else {
        throw new Error('Please select all required habits');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsSendRequestLoading(false);
    }
  };

  return (
    <GradientView>
      <View style={CreateProfileStyles.Container}>
        <CreateProfileHeader
          ProgressCount={6}
          Skip={true}
          handleSkipPress={() => {
            navigation.navigate('LoginStack', {
              screen: 'WhatAboutYou',
            });
          }}
        />

        <View style={styles.DataViewContainer}>
          <View style={[styles.ContentView]}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>Let’s talk about your daily habits!</Text>
            <Text style={[styles.HabitsMatchText, { color: colors.TextColor }]}>
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
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews={true}
            />
          </View>
        </View>

        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            Title={'Continue'}
            Disabled={false}
            isLoading={isSendRequestLoading}
            Navigation={() => onPressNext()}
          />
        </View>
      </View>
    </GradientView>
  );
};

export default memo(AddDailyHabits);

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
    width: hp('11%'),
    height: hp('6.5%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
  HabitOptionText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
});

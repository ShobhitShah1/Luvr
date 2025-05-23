import React, { memo, useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import { WhatAboutYouData } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';

import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

function WhatAboutYou() {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();
  const userData = useSelector((state: any) => state?.user);

  const navigation = useCustomNavigation();
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({
    communication_stry: userData.communication_stry,
    education_level: userData.education_level,
    recived_love: userData.recived_love,
    star_sign: userData.star_sign,
  });

  const [isLoading, setIsSendRequestLoading] = useState<boolean>(false);

  const handleOptionPress = useCallback(
    (habitId: string, option: string) => {
      setSelectedItems(prevSelection => ({
        ...prevSelection,
        [habitId.toString()]: option,
      }));
    },
    [setSelectedItems],
  );

  const renderItem = ({
    item,
  }: {
    item: { id: number; key: string; habit: string; options: string[] };
  }) => {
    return (
      <View key={item.id} style={styles.habitContainer}>
        <Text style={[styles.habitTitle, { color: colors.TitleText }]}>{item.habit}</Text>

        <View style={styles.HabitFlatListView}>
          <FlatList
            numColumns={3}
            data={item.options}
            columnWrapperStyle={styles.columnWrapperStyle}
            style={styles.HabitFlatListStyle}
            showsVerticalScrollIndicator={false}
            keyExtractor={(option, index) => index.toString()}
            renderItem={({ item: option, index }) => {
              const selected = selectedItems[item.key.toString()] === option;

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
                    styles.optionButton,
                    {
                      backgroundColor: isDark
                        ? 'transparent'
                        : selected
                        ? colors.Primary
                        : colors.White,
                    },
                  ]}
                >
                  <Pressable
                    style={{ flex: 1, justifyContent: 'center' }}
                    onPress={() => handleOptionPress(item?.key, option)}
                  >
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.CategoriesText,
                        { color: selected ? colors.White : colors.TextColor },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                </GradientBorderView>
              );
            }}
          />
        </View>
      </View>
    );
  };

  const onNextPress = async () => {
    setIsSendRequestLoading(true);

    try {
      const YourIntoFills = ['communication_stry', 'education_level', 'recived_love', 'star_sign'];

      const allIntoSelected = YourIntoFills.every(into => selectedItems.hasOwnProperty(into));

      if (allIntoSelected) {
        await Promise.all([
          dispatch(
            updateField(LocalStorageFields.communication_stry, selectedItems.communication_stry),
          ),
          dispatch(updateField(LocalStorageFields.education_level, selectedItems.education_level)),
          dispatch(updateField(LocalStorageFields.recived_love, selectedItems.recived_love)),
          dispatch(updateField(LocalStorageFields.star_sign, selectedItems.star_sign)),
        ]);

        setTimeout(() => {
          navigation.navigate('LoginStack', {
            screen: 'YourIntro',
          });
        }, 200);
      } else {
        showToast('Validation Error', 'Please select all required options', 'error');
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
          ProgressCount={7}
          Skip={true}
          handleSkipPress={() => {
            navigation.navigate('LoginStack', { screen: 'YourIntro' });
          }}
        />
        <View style={styles.DataViewContainer}>
          <View style={styles.ContentView}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>
              What's about {'\n'}you?
            </Text>
            <Text style={[styles.AboutYouDescription, { color: colors.TextColor }]}>
              Say something about yourself. so you can match with your magical person
            </Text>
          </View>

          <View style={styles.FlatListContainerView}>
            <FlatList
              data={WhatAboutYouData}
              renderItem={renderItem}
              initialNumToRender={20}
              nestedScrollEnabled={false}
              removeClippedSubviews={true}
              style={styles.FlatListStyle}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>

        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            Title="Continue"
            Disabled={false}
            isLoading={isLoading}
            Navigation={() => {
              setIsSendRequestLoading(true);
              setTimeout(() => onNextPress(), 0);
            }}
          />
        </View>
      </View>
    </GradientView>
  );
}

export default memo(WhatAboutYou);

const styles = StyleSheet.create({
  AboutYouDescription: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.Regular,
    marginTop: hp('1%'),
  },
  BottomButtonWidth: {
    borderTopColor: COLORS.Placeholder,
    bottom: hp('1.5%'),
    position: 'absolute',
    width: '100%',
  },
  ButtonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '90%',
  },
  CategoriesText: {
    alignSelf: 'center',
    width: '85%',
    ...GROUP_FONT.body4,
    color: 'rgba(130, 130, 130, 1)',
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.4%'),
    textAlign: 'center',
  },
  ContentView: {
    maxWidth: '100%',
    overflow: 'hidden',
    paddingHorizontal: hp('2.8%'),
    width: '100%',
  },

  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  FlatListContainerView: {
    height: '72%',
    // marginHorizontal: hp('0.8%'),
  },
  FlatListStyle: {
    height: '100%',
    marginTop: hp('2%'),
  },
  HabitFlatListStyle: {
    overflow: 'hidden',
  },
  HabitFlatListView: {},
  SelectedCategoriesText: {
    color: COLORS.White,
    width: '85%',
  },
  TitleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('3.3%'),
  },
  checkMissingCategories: {
    marginTop: 16,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  habitContainer: {
    alignSelf: 'center',
    paddingTop: hp('1.5%'),
    width: '90%',
  },
  habitTitle: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('1.8%'),
    marginBottom: hp('1%'),
  },
  missingCategoriesText: {
    ...GROUP_FONT.h3,
    color: COLORS.White,
  },
  optionButton: {
    borderRadius: SIZES.radius,
    borderWidth: 2,
    height: hp('6.8%'),
    justifyContent: 'center',
    marginVertical: hp('1%'),
    overflow: 'hidden',
    width: hp('11%'),
  },
  optionsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
    borderColor: COLORS.White,
    borderWidth: 2,
  },
});

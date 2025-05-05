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

const WhatAboutYou = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();
  const userData = useSelector((state: any) => state?.user);

  const navigation = useCustomNavigation();
  const [selectedItems, setSelectedItems] = useState<Record<string, String>>({
    communication_stry: userData.communication_stry,
    education_level: userData.education_level,
    recived_love: userData.recived_love,
    star_sign: userData.star_sign,
  });

  const [isLoading, setIsSendRequestLoading] = useState<boolean>(false);

  const handleOptionPress = useCallback(
    (habitId: string, option: string) => {
      setSelectedItems((prevSelection) => ({
        ...prevSelection,
        [habitId.toString()]: option,
      }));
    },
    [setSelectedItems]
  );

  const renderItem = ({ item }: { item: { id: number; key: string; habit: string; options: string[] } }) => {
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
                    { backgroundColor: isDark ? 'transparent' : selected ? colors.Primary : colors.White },
                  ]}
                >
                  <Pressable
                    style={{ flex: 1, justifyContent: 'center' }}
                    onPress={() => handleOptionPress(item?.key, option)}
                  >
                    <Text
                      numberOfLines={2}
                      style={[styles.CategoriesText, { color: selected ? colors.White : colors.TextColor }]}
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

      const allIntoSelected = YourIntoFills.every((into) => selectedItems.hasOwnProperty(into));

      if (allIntoSelected) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.communication_stry, selectedItems.communication_stry)),
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
          <View style={[styles.ContentView]}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>What's about {'\n'}you?</Text>
            <Text style={[styles.AboutYouDescription, { color: colors.TextColor }]}>
              Say something about yourself. so you can match with your magical person
            </Text>
          </View>

          <View style={[styles.FlatListContainerView]}>
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

        <View style={[CreateProfileStyles.BottomButton]}>
          <GradientButton
            Title={'Continue'}
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
};

export default memo(WhatAboutYou);

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
    width: '90%',
    alignSelf: 'center',
    paddingTop: hp('1.5%'),
  },
  habitTitle: {
    marginBottom: hp('1%'),
    fontSize: hp('1.8%'),
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  HabitFlatListView: {},
  HabitFlatListStyle: {
    overflow: 'hidden',
  },
  optionButton: {
    width: hp('11%'),
    overflow: 'hidden',
    height: hp('6.8%'),
    borderWidth: 2,
    justifyContent: 'center',
    marginVertical: hp('1%'),
    borderRadius: SIZES.radius,
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
    borderWidth: 2,
    borderColor: COLORS.White,
  },
  CategoriesText: {
    width: '85%',
    alignSelf: 'center',
    ...GROUP_FONT.body4,
    color: 'rgba(130, 130, 130, 1)',
    fontSize: hp('1.4%'),
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  SelectedCategoriesText: {
    width: '85%',
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
  },
  BottomButtonWidth: {
    width: '100%',
    bottom: hp('1.5%'),
    position: 'absolute',
    borderTopColor: COLORS.Placeholder,
  },
  FlatListContainerView: {
    height: '72%',
    // marginHorizontal: hp('0.8%'),
  },
  FlatListStyle: {
    height: '100%',
    marginTop: hp('2%'),
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
});

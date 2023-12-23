import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import WhatAboutYouData from '../../../Components/Data/WhatElseExtraData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {UserDataType} from '../../../Types/UserDataType';
import {useUserData} from '../../../Contexts/UserDataContext';
import useHandleInputChangeSignUp from '../../../Hooks/useHandleInputChangeSignUp';

const WhatAboutYou: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const {userData, dispatch} = useUserData();
  const handleInputChange = useHandleInputChangeSignUp();

  const data = transformUserDataForApi(userData);
  // console.log('data', data);
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );

  const handleOptionPress = useCallback(
    (habitId: number, option: string) => {
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
    item: {id: number; key: string; habit: string; options: string[]};
  }) => {
    return (
      <View key={item.id} style={styles.habitContainer}>
        <Text style={styles.habitTitle}>{item.habit}</Text>
        <View style={styles.HabitFlatListView}>
          <FlatList
            numColumns={3}
            data={item.options}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            style={styles.HabitFlatListStyle}
            showsVerticalScrollIndicator={false}
            keyExtractor={(option, index) => index.toString()}
            renderItem={({item: option, index}) => (
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                key={index}
                style={[
                  styles.optionButton,
                  selectedItems[item.key.toString()] === option &&
                    styles.selectedOption,
                ]}
                onPress={() => handleOptionPress(item.key, option)}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.CategoriesText,
                    selectedItems[item.key.toString()] === option &&
                      styles.SelectedCategoriesText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  };

  const onNextPress = () => {
    if (true) {
      console.log('selectedItems', selectedItems);
      navigation.navigate('LoginStack', {
        screen: 'YourIntro',
      });
    } else {
    }
  };

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
            data={WhatAboutYouData}
            renderItem={renderItem}
            initialNumToRender={20}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            style={styles.FlatListStyle}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </View>

      <View style={[CreateProfileStyles.BottomButton]}>
        <GradientButton
          Title={'Continue'}
          Disabled={false}
          Navigation={() => onNextPress()}
        />
      </View>
    </View>
  );
};

export default WhatAboutYou;

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
    width: hp('12%'),
    overflow: 'hidden',
    height: hp('6.8%'),
    justifyContent: 'center',
    marginVertical: hp('1%'),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
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
});

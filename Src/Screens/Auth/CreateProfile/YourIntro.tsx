import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import YourIntoData from '../../../Components/Data/YourIntoData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import LifestyleData from '../../../Components/Data/LifestyleData';

const YourIntro: FC = () => {
  let ProgressCount: number = 0.9;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );

  console.log('selectedItems:', selectedItems);

  const handleOptionPress = useCallback((YourIntoID: number, name: string) => {
    setSelectedItems(prevSelection => {
      if (prevSelection[YourIntoID.toString()] === name) {
        const {[YourIntoID.toString()]: removedItem, ...rest} = prevSelection;
        return rest;
      }

      if (Object.keys(prevSelection).length >= 5) {
        return prevSelection;
      }

      return {
        ...prevSelection,
        [YourIntoID.toString()]: name,
      };
    });
  }, []);

  const renderItem = useMemo(
    () =>
      ({item}: {item: {id: number; name: string}}, index: number) => {
        const selectedOption = selectedItems[item.id.toString()];
        return (
          <View style={styles.YourIntoScrollViewContainer}>
            <TouchableOpacity
              key={index}
              style={[
                styles.YourIntoButton,
                selectedOption === item.name && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(item.id, item.name)}>
              <Text
                style={[
                  styles.CategoriesText,
                  selectedOption === item.name && styles.SelectedCategoriesText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    [selectedItems, handleOptionPress],
  );

  // const renderItem = (
  //   {item}: {item: {id: number; name: string}},
  //   index: number,
  // ) => {
  //   const selectedOption = selectedItems[item.id.toString()];
  //   return (
  //     <View style={styles.YourIntoScrollViewContainer}>
  //       <TouchableOpacity
  //         key={index}
  //         style={[styles.YourIntoButton]}
  //         onPress={() => {}}>
  //         <Text style={[styles.CategoriesText]}>{item.name}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const selectedItemsKeys = Object.keys(selectedItems);

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={true} />
      <View style={[styles.ContentView]}>
        <Text style={CreateProfileStyles.TitleText}>What are you into?</Text>
        <Text style={styles.YourIntoMatchText}>
          You like what you like. Now, let everyone know.
        </Text>
      </View>

      <View style={[{height: '72%'}]}>
        <FlatList
          data={YourIntoData}
          renderItem={renderItem}
          style={styles.FlatListStyle}
          contentContainerStyle={styles.ContainerContainerStyle}
          initialNumToRender={50}
          nestedScrollEnabled={false}
          removeClippedSubviews={true}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View style={[styles.BottomButtonWidth]}>
        <View style={styles.ButtonContainer}>
          <GradientButton
            Title={`Next ${selectedItemsKeys?.length || 0}/5`}
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
  FlatListStyle: {
    height: '100%',
    marginHorizontal: hp('1%'),
  },
  ContainerContainerStyle: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
  },
  YourIntoMatchText: {
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

  // ========

  YourIntoScrollViewContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  YourIntoButton: {
    borderRadius: hp('2%'),
    marginRight: hp('0.8%'),
    borderWidth: hp('0.064%'),
    borderColor: COLORS.Gray,
    marginVertical: hp('0.5%'),
    paddingHorizontal: hp('1%'),
    paddingVertical: hp('0.5%'),
    marginHorizontal: hp('0.5%'),
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
  },
  CategoriesText: {
    textAlign: 'center',
    ...GROUP_FONT.h4,
    color: COLORS.Gray,
  },
  SelectedCategoriesText: {
    ...GROUP_FONT.h4,
    color: COLORS.White,
  },
});

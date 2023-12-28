import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import LookingFor from '../../../Components/Data/LookingFor';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {updateField} from '../../../Redux/Action/userActions';

interface ItemProps {
  id: number;
  Title: string;
  Emoji: string;
  Icon: string;
}

const {width} = Dimensions.get('window');

const HopingToFind: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [SelectedLookingForIndex, setSelectedLookingForIndex] =
    useState<ItemProps>(userData.hoping ? userData.hoping : {});

  console.log('SelectedLookingForIndex', SelectedLookingForIndex);

  const onPressLookingFor = useCallback(
    (item: ItemProps) => {
      //* Check if the selected item is already in the array
      const isSelected = SelectedLookingForIndex.Title === item?.Title;

      //* If the selected item is already in the array, unselect it
      if (isSelected) {
        setSelectedLookingForIndex({
          id: -1,
          Title: '',
          Emoji: '',
          Icon: '',
        });
      } else {
        //* If the selected item is not in the array, select it and unselect the previous one
        setSelectedLookingForIndex(item);
      }

      console.log('SelectedLookingForIndex', SelectedLookingForIndex);
    },
    [SelectedLookingForIndex],
  );

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const Selected = SelectedLookingForIndex?.Title === item?.Title;
    return (
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => onPressLookingFor(item)}
        style={styles.LookingForListView}
        key={index}>
        <View style={styles.TextView}>
          <Text
            numberOfLines={2}
            style={[
              styles.LookingForText,
              {
                fontFamily: Selected ? FONTS.Bold : FONTS.Medium,
              },
            ]}>
            {item.Title}
          </Text>
          {Selected && (
            <Image
              resizeMethod="auto"
              resizeMode="contain"
              source={CommonIcons.CheckMark}
              style={{width: hp('2.5%'), height: hp('2.5%')}}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const onPressNext = () => {
    if (SelectedLookingForIndex) {
      navigation.navigate('LoginStack', {
        screen: 'DistancePreference',
      });
      setTimeout(() => {
        dispatch(
          updateField(LocalStorageFields.hoping, SelectedLookingForIndex),
        );
      }, 0);
    } else {
      Alert.alert('Error', 'Please select your hoping');
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={3} Skip={false} />

      <View style={styles.DataViewContainer}>
        <View style={CreateProfileStyles.ContentView}>
          <Text style={styles.TitleText}>
            What’s your hoping {'\n'}to find?
          </Text>
          <Text style={styles.CompatibilityText}>
            Honesty helps you and everyone on find what you're looking for.
          </Text>
        </View>

        <FlatList
          data={LookingFor}
          renderItem={renderItem}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          isLoading={false}
          Title={'Continue'}
          Disabled={SelectedLookingForIndex ? false : true}
          Navigation={() => onPressNext()}
        />
      </View>
    </View>
  );
};

export default HopingToFind;

const styles = StyleSheet.create({
  CompatibilityText: {
    width: '90%',
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Medium,
  },
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  FlatListContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp('5%'),
  },
  SelectedLookingForListView: {
    width: '31%',
    left: hp('0.5%'),
    alignContent: 'center',
    marginHorizontal: hp('0.4%'),
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp('15%'),
    borderRadius: hp('1%'),
    marginVertical: hp('0.5%'),
    overflow: 'hidden',
    borderWidth: hp('0.2%'),
    borderColor: COLORS.Primary,
  },
  LookingForListView: {
    height: hp('6.5%'),
    width: width - hp('8%'),
    marginVertical: hp('0.5%'),
    alignSelf: 'center',
    backgroundColor: COLORS.White,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignContent: 'center',
  },
  GenderFlexView: {
    flexDirection: 'row',
    marginHorizontal: hp('2.8%'),
    justifyContent: 'space-between',
  },
  TextView: {
    flexDirection: 'row',
    marginHorizontal: hp('2.8%'),
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '85%',
  },
  EmojiText: {
    ...GROUP_FONT.h1,
    textAlign: 'center',
    marginVertical: hp('0.5%'),
  },
  LookingForText: {
    ...GROUP_FONT.h3,
    // marginVertical: hp('0.2%'),
    // ...GROUP_FONT.body3,
    // fontSize: hp('1.6%'),
    // color: COLORS.Black,
    // textAlign: 'center',
  },
});

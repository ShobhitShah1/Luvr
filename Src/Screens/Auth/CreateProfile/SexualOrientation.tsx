/* eslint-disable react/no-unstable-nested-components */
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
import CustomCheckBox from '../../../Components/CustomCheckBox';
import {GendersData} from '../../../Components/Data';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const {width} = Dimensions.get('window');

const SexualOrientation: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const initialSexualOrientation: string[] =
    userData.orientation.length !== 0 ? userData.orientation : [];

  const [ShowOnProfile, setShowOnProfile] = useState<boolean>(
    userData.isOrientationVisible,
  );
  const [SelectedGenderIndex, setSelectedGenderIndex] = useState<string[]>(
    initialSexualOrientation,
  );

  const toggleCheckMark = useCallback(() => {
    setShowOnProfile(prev => !prev);
  }, []);

  const onPressGenders = useCallback(
    (item: {id: number; name: string}) => {
      const {name} = item;
      if (SelectedGenderIndex.includes(name)) {
        setSelectedGenderIndex(prev =>
          prev.filter(selectedName => selectedName !== name),
        );
      } else if (SelectedGenderIndex.length < 3) {
        setSelectedGenderIndex(prev => [...prev, name]);
      }
    },
    [SelectedGenderIndex],
  );

  const isGenderSelected = (item: string) =>
    SelectedGenderIndex.includes(item?.name);

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      key={index}
      activeOpacity={ActiveOpacity}
      onPress={() => onPressGenders(item)}
      style={styles.GenderButtonView}>
      <View style={styles.GenderFlexView}>
        <Text
          style={[
            styles.SelectGenderText,
            {
              fontFamily: isGenderSelected(item) ? FONTS.Bold : FONTS.Medium,
            },
          ]}>
          {item.name}
        </Text>
        {isGenderSelected(item) && (
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

  const ListEmptyComponent = () => (
    <View style={styles.EmptyViewStyle}>
      <Text style={styles.EmptyViewText}>We Don't Have Any Genders, Sorry</Text>
    </View>
  );

  const OnNextButtonClick = () => {
    const orientations = SelectedGenderIndex.map(gender => gender);
    if (orientations.length !== 0) {
      navigation.navigate('LoginStack', {
        screen: 'HopingToFind',
      });
      setTimeout(() => {
        try {
          dispatch(updateField(LocalStorageFields.orientation, orientations));
          dispatch(
            updateField(LocalStorageFields.isOrientationVisible, ShowOnProfile),
          );
        } catch (error) {
          console.log('err', error);
        }
      }, 0);
    } else {
      Alert.alert('Error', 'Please select your sexual orientation');
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader
        ProgressCount={2}
        Skip={true}
        handleSkipPress={() => {
          navigation.navigate('LoginStack', {
            screen: 'HopingToFind',
          });
        }}
      />

      <View style={styles.RenderDataContainer}>
        <View style={CreateProfileStyles.ContentView}>
          <Text style={styles.TitleText}>What is your sexual orientation?</Text>
          <Text style={styles.SelectUptoText}>Select upto 3</Text>
        </View>

        <View style={{height: '67%'}}>
          <FlatList
            data={GendersData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </View>

      <View style={[styles.BottomContainer]}>
        <View style={styles.BottomView}>
          <View style={styles.CheckBoxView}>
            <CustomCheckBox
              isChecked={ShowOnProfile}
              onToggle={toggleCheckMark}
              BoxText="Show my orientation on my profile"
            />
            {/* <Text style={styles.CheckboxText}>
              Show my orientation on my profile
            </Text> */}
          </View>
          <GradientButton
            isLoading={false}
            Title={'Continue'}
            Disabled={SelectedGenderIndex.length !== 0 ? false : true}
            Navigation={OnNextButtonClick}
          />
        </View>
      </View>
    </View>
  );
};

export default SexualOrientation;

const styles = StyleSheet.create({
  SelectUptoText: {
    ...GROUP_FONT.h4,
    marginVertical: hp('1%'),
    fontFamily: FONTS.SemiBold,
  },
  RenderDataContainer: {
    flex: 1,
    paddingHorizontal: hp('1'),
    marginTop: hp('1'),
  },
  BottomContainer: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('2%'),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  BottomView: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: hp('1.9%'),
  },
  BorderBottomWidth: {
    width: '110%',
    right: hp('1.5%'),
    marginTop: hp('1%'),
    borderBottomWidth: hp('0.1%'),
    borderBottomColor: COLORS.Black,
  },
  GenderButtonView: {
    height: hp('6.5%'),
    width: width - hp('8%'),
    marginVertical: hp('0.5%'),
    alignSelf: 'center',
    backgroundColor: COLORS.White,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignContent: 'center',
  },
  SelectGenderFlexView: {
    flexDirection: 'row',
    marginHorizontal: hp('2%'),
    justifyContent: 'space-between',
  },
  GenderFlexView: {
    flexDirection: 'row',
    marginHorizontal: hp('2.8%'),
    justifyContent: 'space-between',
  },
  SelectGenderText: {
    ...GROUP_FONT.h3,
  },
  CheckBoxView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  CheckboxText: {
    ...GROUP_FONT.h4,
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Medium,
  },
  EmptyViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  EmptyViewText: {
    ...GROUP_FONT.h2,
    textAlign: 'center',
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
});

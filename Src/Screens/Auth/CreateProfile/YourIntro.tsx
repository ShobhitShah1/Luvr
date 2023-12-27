/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import YourIntoData from '../../../Components/Data/YourIntoData';
import {useUserData} from '../../../Contexts/UserDataContext';
import useHandleInputChangeSignUp from '../../../Hooks/useHandleInputChangeSignUp';
import UserService from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {useCustomToast} from '../../../Utils/toastUtils';

const YourIntro: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const handleInputChange = useHandleInputChangeSignUp();
  const {userData} = useUserData();
  const {showToast} = useCustomToast();
  const [IsAPILoading, setIsAPILoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    userData.likesInto,
  );

  const handleOptionPress = useCallback((YourIntoID: number, name: string) => {
    setSelectedItems(prevSelection => {
      if (prevSelection.includes(name)) {
        return prevSelection.filter(item => item !== name);
      }

      if (prevSelection.length >= 5) {
        return prevSelection;
      }

      return [...prevSelection, name];
    });
  }, []);

  const renderItem = useMemo(
    () =>
      ({item}: {item: {id: number; name: string}}) => {
        const selectedOption = selectedItems.includes(item.name);
        return (
          <View style={styles.YourIntoScrollViewContainer}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={[
                styles.YourIntoButton,
                selectedOption && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(item.id, item.name)}>
              <Text
                numberOfLines={2}
                style={[
                  styles.CategoriesText,
                  selectedOption && styles.SelectedCategoriesText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    [selectedItems, handleOptionPress],
  );

  const onPressNext = async () => {
    setIsAPILoading(true);
    try {
      if (selectedItems.length === 5) {
        console.log('selectedItems', selectedItems);
        handleInputChange(LocalStorageFields.likesInto, selectedItems);
        handleInputChange(LocalStorageFields.eventName, 'app_user_register');
        handleInputChange(LocalStorageFields.loginType, 'non_social');

        const userDataForApi = transformUserDataForApi(userData);
        console.log('userDataForApi', userDataForApi);

        const APIResponse = await UserService.UserRegister(userDataForApi);
        console.log('APIResponse', APIResponse);

        if (APIResponse && APIResponse.code === 200) {
          showToast(
            'Registration Successful',
            'Thank you for registering! You can now proceed.',
            'success',
          );
          navigation.replace('LoginStack', {
            screen: 'AddRecentPics',
          });
        } else {
          const errorMessage =
            APIResponse && APIResponse.error
              ? APIResponse.error
              : 'Unknown error occurred during registration.';
          throw new Error(errorMessage);
        }
      } else {
        throw new Error('Please select exactly 5 items before proceeding.');
      }
    } catch (error) {
      console.error('Error during registration:', error);

      showToast(
        'Registration Error',
        `Failed to complete registration. ${error?.message}`,
        'error',
      );
    } finally {
      setIsAPILoading(false);
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader
        ProgressCount={8}
        Skip={true}
        handleSkipPress={() => {
          navigation.navigate('LoginStack', {
            screen: 'AddRecentPics',
          });
        }}
      />
      <View style={styles.DataViewContainer}>
        <View style={[styles.ContentView]}>
          <Text style={styles.TitleText}>What are you into?</Text>
          <Text style={styles.YourIntoMatchText}>
            You like what you like. Now, let everyone know.
          </Text>
        </View>

        <View style={[styles.FlatListContainer]}>
          <FlatList
            numColumns={3}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={YourIntoData}
            renderItem={renderItem}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            style={styles.FlatListStyle}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>
      <View style={[CreateProfileStyles.BottomButton]}>
        <GradientButton
          isLoading={IsAPILoading}
          Title={`Next ${selectedItems.length}/5`}
          Disabled={false}
          Navigation={onPressNext}
        />
      </View>
    </View>
  );
};

export default YourIntro;

const styles = StyleSheet.create({
  ContentView: {
    width: '100%',
    overflow: 'hidden',
    // paddingHorizontal: hp('2.8%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  DataViewContainer: {
    height: '90%',
    width: '84%',
    alignSelf: 'center',
    marginTop: hp('1%'),
    // marginHorizontal: hp('5%'),
  },
  FlatListStyle: {},
  ContainerContainerStyle: {
    width: '100%',
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
  },
  BottomButtonWidth: {
    width: '100%',
    bottom: hp('1.5%'),
    position: 'absolute',
    paddingTop: hp('1.5%'),
    borderTopWidth: hp('0.07%'),
    borderTopColor: COLORS.Placeholder,
  },
  YourIntoScrollViewContainer: {},
  YourIntoButton: {
    width: hp('12%'),
    height: hp('6.8%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    marginVertical: hp('1%'),
    backgroundColor: COLORS.White,
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
    borderWidth: 2,
    borderColor: COLORS.White,
  },
  CategoriesText: {
    width: '85%',
    justifyContent: 'center',
    alignSelf: 'center',
    ...GROUP_FONT.body4,
    fontSize: hp('1.5%'),
    color: 'rgba(130, 130, 130, 1)',
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  SelectedCategoriesText: {
    color: COLORS.White,
  },
  FlatListContainer: {
    height: '72%',
    marginTop: hp('1.5%'),
  },
});

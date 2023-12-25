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
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import useHandleInputChangeSignUp from '../../../Hooks/useHandleInputChangeSignUp';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {postUserData} from '../../../Services/ApiService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {useUserData} from '../../../Contexts/UserDataContext';
import {checkInternetConnection, postFormData} from '../../../utils/apiUtils';
import useInternetConnection from '../../../Hooks/useInternetConnection';
import UserService from '../../../Services/AuthService';

const YourIntro: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const handleInputChange = useHandleInputChangeSignUp();
  const {userData} = useUserData();
  const transformedUserData = transformUserDataForApi(userData);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
    if (selectedItems.length === 5) {
      console.log('selectedItems', selectedItems);
      handleInputChange(LocalStorageFields.likesInto, selectedItems);
      handleInputChange(LocalStorageFields.eventName, 'app_user_register');
      handleInputChange(LocalStorageFields.loginType, 'non_social');

      try {
        const userDataForApi = transformUserDataForApi(userData);

        const APIResponse = await UserService.UserRegister(userDataForApi);

        console.log('APIResponse', APIResponse);



        // const axios = require('axios');
        // let data = JSON.stringify({
        //   eventName: 'app_user_register',
        //   login_type: 'non_social',
        //   user_from: 'app',
        //   mobile_no: '9876543211',
        //   identity: 'identity',
        //   profile_image: '',
        //   Full_name: '',
        //   birthdate: '',
        //   gender: '',
        //   city: '',
        //   orientation: ['orientation1', 'orientation2'],
        //   is_orientation_visible: true,
        //   hoping: 'hoping',
        //   education: {
        //     digree: '',
        //     college_name: '',
        //   },
        //   habits: {
        //     exercise: 'daily',
        //     smoke: 'daily',
        //     movies: 'daily',
        //     drink: 'daily',
        //   },
        //   magical_person: {
        //     communication_stry: 'introvert',
        //     recived_love: 'introvert',
        //     education_level: '',
        //     star_sign: 'scorpio',
        //   },
        //   likes_into: ['', ''],
        //   is_block_contact: false,
        //   latitude: 0,
        //   longitude: 0,
        //   radius: 0,
        //   recent_pik: [],
        // });

        // let config = {
        //   method: 'post',
        //   maxBodyLength: Infinity,
        //   url: 'https://nirvanatechlabs.in/dating/data',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     app_secret: '_d_a_t_i_n_g_',
        //   },
        //   data: data,
        // };

        // axios
        //   .request(config)
        //   .then(response => {
        //     console.log(JSON.stringify(response.data));
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });




      } catch (error) {
        console.error('Error posting user data:', error);
        // Handle errors or show an alert to the user
      }
    } else {
      Alert.alert('Error', 'Please select exactly 5 items before proceeding.');
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={8} Skip={true} />
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

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import CustomTextInput from '../../Components/CustomTextInput';
import {TotalProfilePicCanUploadEditProfile} from '../../Config/Setting';
import {useCameraPermission} from '../../Hooks/useCameraPermission';
import {useGalleryPermission} from '../../Hooks/useGalleryPermission';
import UserService from '../../Services/AuthService';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import {useLocationPermission} from '../../Hooks/useLocationPermission';
import {updateField} from '../../Redux/Action/userActions';
import {LocalStorageFields} from '../../Types/LocalStorageFields';
import {ProfileType} from '../../Types/ProfileType';
import {useCustomToast} from '../../Utils/toastUtils';
import ChooseFromModal from '../Auth/CreateProfile/Components/ChooseFromModal';
import EditProfileAllImageView from './Components/EditProfileComponents/EditProfileAllImageView';
import EditProfileBoxView from './Components/EditProfileComponents/EditProfileBoxView';
import EditProfileCategoriesList from './Components/EditProfileComponents/EditProfileCategoriesList';
import EditProfileSheetView from './Components/EditProfileComponents/EditProfileSheetView';
import EditProfileTitleView from './Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from './Components/ProfileAndSettingHeader';
import ApiConfig from '../../Config/ApiConfig';
import axios from 'axios';

export interface ViewPositionsProps {
  Gender: number;
  CommunicationStyle: number;
  ImInto: number;
  LookingFor: number;
  ZodiacSign: number;
  SmokeAndDrink: number;
  Exercise: number;
  InterestedIn: number;
  Movie: number;
  Drink: number;
}

const EditProfileScreen = () => {
  const dayInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const monthInputRef = useRef(null);

  const {requestCameraPermission} = useCameraPermission();
  const {requestGalleryPermission} = useGalleryPermission();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const UserData = useSelector((state: any) => state?.user);
  const [IsFetchDataAPILoading, setIsFetchDataAPILoading] = useState(false);
  const [profile, setProfile] = useState<ProfileType>();
  const [IsInternetConnected, setIsInternetConnected] = useState(true);
  const [ChooseModalVisible, setChooseModalVisible] = useState<boolean>(false);
  const [Bio, setBio] = useState(profile?.about);
  const [UserName, setUserName] = useState(profile?.full_name);
  const [City, setCity] = useState(profile?.city);
  const [CollegeName, setCollegeName] = useState(
    profile?.education?.college_name,
  );
  const [EducationDegree, setEducationDegree] = useState(
    profile?.education?.digree,
  );
  // console.log('UserData', UserData);
  const Day = profile?.birthdate?.split('/')[0];
  const Month = profile?.birthdate?.split('/')[1];
  const Year = profile?.birthdate?.split('/')[2];
  const [BirthdateDay, setBirthdateDay] = useState(Day);
  const [BirthdateMonth, setBirthdateMonth] = useState(Month);
  const [BirthdateYear, setBirthdateYear] = useState(Year);

  const [UserPicks, setUserPicks] = useState(
    Array.from({length: TotalProfilePicCanUploadEditProfile}, (_, index) => ({
      name: '',
      type: '',
      key: String(index),
      url: '',
    })),
  );

  const scrollViewRef = useRef<ScrollView>(null);

  const [viewPositions, setViewPositions] = useState({
    Gender: 0,
    ImInto: 126.0952377319336,
    LookingFor: 1344.3809814453125,
    InterestedIn: 1757.3333740234375,
    ZodiacSign: 2447.619140625,
    CommunicationStyle: 2801.90478515625,
    Exercise: 2940.1904296875,
    SmokeAndDrink: 3078.47607421875,
    Movie: 3216.761962890625,
    Drink: 3355.047607421875,
  });

  const [ClickCategoryName, setClickCategoryName] = useState('');

  useEffect(() => {
    const CheckConnection = () => {
      try {
        NetInfo.fetch().then(info => {
          if (info.isConnected) {
            setIsFetchDataAPILoading(true);
            setIsInternetConnected(true);
            Promise.all([GetProfileData(), CheckLocationPermission()]);
          } else {
            setIsInternetConnected(false);
          }
        });
      } catch (error) {
        console.error(
          'Error fetching profile data or checking location permission:',
          error,
        );
        setIsInternetConnected(false);
        setIsFetchDataAPILoading(false);
      }
    };

    CheckConnection();
  }, []);

  const {locationPermission, requestLocationPermission} =
    useLocationPermission();

  const calculateAge = inputDate => {
    const [day, month, year] = inputDate
      .split(',')
      .map(item => parseInt(item.trim(), 10));

    // Validation for month (1-12)
    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Month must be between 1 and 12.');
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isEligible = age => {
    return age >= 18 && age < 100;
  };

  const handleTextInputChange = (
    value,
    setValueFunc,
    maxLength,
    nextInputRef,
  ) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Filter out non-numeric characters
    setValueFunc(numericValue); // Set the filtered numeric value

    // Check if the current input has reached its maximum length and the input is valid
    if (numericValue.length === maxLength && nextInputRef) {
      nextInputRef.current.focus(); // Focus on the next input
    }
  };

  //* Check User Location Permission
  const CheckLocationPermission = async () => {
    if (locationPermission) {
      StoreLocationPermission();
    } else {
      const requestPermission = await requestLocationPermission();
      if (requestPermission) {
        StoreLocationPermission();
      } else {
      }
    }
  };

  //* Get User Let And Long
  const StoreLocationPermission = async () => {
    try {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async position => {
            const {coords} = position;
            if (coords) {
              await Promise.all([
                dispatch(
                  updateField(LocalStorageFields.longitude, coords.longitude),
                ),
                dispatch(
                  updateField(LocalStorageFields.latitude, coords.latitude),
                ),
              ]);
            }
          },
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    } catch (error: any) {
      console.error(error, error?.message);
      showToast(
        'Something went wrong',
        String(
          error?.message ||
            'Unable to find your location please try gain letter',
        ),
        'error',
      );
    } finally {
    }
  };

  const GetProfileData = async () => {
    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        const DataToStore: ProfileType = APIResponse?.data
          ? APIResponse?.data
          : {};

        console.log('recent_pik:', DataToStore.recent_pik);

        // Set default values if magical_person or habits are empty
        if (
          !DataToStore.magical_person ||
          Object.keys(DataToStore.magical_person).length === 0
        ) {
          DataToStore.magical_person = {
            communication_stry: '',
            education_level: '',
            recived_love: '',
            star_sign: '',
          };
        }

        if (
          !DataToStore.habits ||
          Object.keys(DataToStore.habits).length === 0
        ) {
          DataToStore.habits = {
            drink: '',
            exercise: '',
            movies: '',
            smoke: '',
          };
        }

        setProfile(DataToStore);
        setBio(DataToStore.about);
        setUserName(DataToStore?.full_name);
        setCity(DataToStore?.city);
        setCollegeName(DataToStore.education.college_name);
        setEducationDegree(DataToStore.education.digree);
        setBirthdateDay(DataToStore?.birthdate?.split('/')[0]);
        setBirthdateMonth(DataToStore?.birthdate?.split('/')[1]);
        setBirthdateYear(DataToStore?.birthdate?.split('/')[2]);

        if (DataToStore?.recent_pik?.length !== 0) {
          DataToStore?.recent_pik?.forEach((res, index) => {
            if (index < TotalProfilePicCanUploadEditProfile) {
              const pathParts = res.split('/');
              const name = pathParts[pathParts.length - 1];

              setUserPicks(prevUserPicks => {
                const updatedUserPicks = [...prevUserPicks];
                const existingPick = updatedUserPicks[index];

                if (existingPick) {
                  updatedUserPicks[index] = {
                    ...existingPick,
                    name,
                    url: res,
                    key: res,
                  };
                }

                return updatedUserPicks;
              });
            }
          });
        }
        setIsFetchDataAPILoading(false);
      } else {
        setProfile({} as ProfileType);
        setIsFetchDataAPILoading(false);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
      setIsFetchDataAPILoading(false);
    }
  };

  //* Birthdate Focus Handler
  const handleTextChange = (value: string, nextInputRef: any) => {
    if (value.length === 2) {
      nextInputRef.current.focus();
    }
  };

  //* Handle Sheet Open/Close
  const handlePresentModalPress = useCallback((name: string) => {
    bottomSheetModalRef.current?.present();
    setClickCategoryName(name);
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log('handleSheetChanges', index);
      console.log('ClickCategoryName', ClickCategoryName);
      console.log('viewPositions', viewPositions);
      console.log(
        'viewPositions[ClickCategoryName]:',
        viewPositions[ClickCategoryName as keyof typeof viewPositions], // Use type assertion
      );

      // setTimeout(() => {
      if (
        index === 0 &&
        viewPositions[ClickCategoryName as keyof typeof viewPositions] !==
          undefined
      ) {
        scrollViewRef.current?.scrollTo({
          x: 0,
          y: viewPositions[ClickCategoryName as keyof typeof viewPositions],
          animated: true,
        });
      }
      // }, 0);
    },
    [ClickCategoryName, viewPositions, bottomSheetModalRef, scrollViewRef],
  );

  //* Toggle Modal Open
  const OnToggleModal = () => {
    setChooseModalVisible(!ChooseModalVisible);
  };

  //* Manage Gallery Image Pick
  const HandleGalleryImagePicker = async () => {
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit:
          TotalProfilePicCanUploadEditProfile -
          UserPicks.filter(item => item.url !== '').length,
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: image.fileName || '',
          type: image.type || '',
          key: `${Date.now()}-${index}`,
          url: image.uri || '',
        })) || [];

      if (newImages.length > 0) {
        UploadImage(newImages);
        // const newData = UserPicks.map(item =>
        //   item.url === '' ? newImages.shift() || item : item,
        // );
        // setUserPicks(newData);
        // console.log('Selected Images:', newData);
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
  };

  //* Manage Camera Image Pick
  const HandleCameraImagePicker = async () => {
    try {
      const res = await ImagePicker.launchCamera({
        mediaType: 'photo',
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: image.fileName || '',
          type: image.type || '',
          key: `${Date.now()}-${index}`,
          url: image.uri || '',
        })) || [];

      if (newImages.length > 0) {
        UploadImage(newImages);
        // const newData = UserPicks.map(item =>
        //   item.url === '' ? newImages.shift() || item : item,
        // );
        // setUserPicks(newData);
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
  };

  const HandleUserSelection = async (selectedOption: string) => {
    try {
      const permissionStatus =
        selectedOption === 'Camera'
          ? await requestCameraPermission()
          : await requestGalleryPermission();

      if (permissionStatus) {
        console.log(
          `${selectedOption} permission granted. Opening ${selectedOption.toLowerCase()}...`,
        );

        if (selectedOption === 'Camera') {
          await HandleCameraImagePicker();
        } else {
          await HandleGalleryImagePicker();
        }

        setChooseModalVisible(false);
      }
    } catch (error) {
      console.error('Error handling user selection:', error);
    }
  };

  // Convert FormData to an object
  function formDataToObject(formData) {
    const object = {};
    formData &&
      formData?.forEach((value, key) => {
        if (!object.hasOwnProperty(key)) {
          object[key] = value;
        } else {
          if (!Array.isArray(object[key])) {
            object[key] = [object[key]];
          }
          object[key].push(value);
        }
      });
    return object;
  }

  //* Upload Single Image
  const UploadImage = async (item: any) => {
    // console.log('UploadImage Item:', item);
    setIsFetchDataAPILoading(true);
    let formData = new FormData();

    // Ensure item is an array and not null
    if (Array.isArray(item)) {
      item.forEach(({url, type, name}) => {
        console.log('URL TYPE AND NAME:', url, type, name);
        // Check if URL exists and is a string
        formData.append('eventName', 'update_profile');
        formData.append('file_to', 'profile_images');
        if (url && typeof url === 'string') {
          formData.append('file', {
            uri: Platform.OS === 'android' ? url : url.replace('file://', ''),
            type,
            name: 'testname.jpg',
          });
        } else {
          console.error('Invalid URL:', url);
        }
      });

      console.log('FormData:', formData);

      try {
        const APIResponse = await axios.post(
          ApiConfig.IMAGE_UPLOAD_BASE_URL,
          formData,
          {
            headers: {
              Authorization: `Bearer ${UserData.Token}`,
              app_secret: '_d_a_t_i_n_g_',
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        // if (APIResponse.code === 200) {
        //   const newData = UserPicks.map(data =>
        //     data.url === '' ? item.shift() || data : data,
        //   );
        console.log('APIResponse?.code', APIResponse?.code);
        console.log('APIResponse?.data', APIResponse?.data);
        if (APIResponse?.data?.code === 200) {
          GetProfileData();
          showToast(
            'Image Uploaded',
            'Your Image has been uploaded successfully.',
            'success',
          );
          // Handle API response here
        } else {
          showToast('Error', 'Error while uploaded image', 'error');
        }
      } catch (error) {
        console.error('API Error:', error);
        // Handle error
      } finally {
        setIsFetchDataAPILoading(false);
      }
    } else {
      console.error('Invalid item:', item);
      setIsFetchDataAPILoading(false);
    }
  };

  //* Update Profile API Call (API CALL)
  const onUpdateProfile = async () => {
    setIsFetchDataAPILoading(true);
    try {
      if (!IsInternetConnected) {
        showToast(
          'Network Issue',
          'Please check your internet connection and try again',
          'error',
        );
        return;
      }

      const age = calculateAge(
        `${BirthdateDay},${BirthdateMonth},${BirthdateYear}`,
      );
      const isValid = isEligible(age);
      // const age = calculateAge(BirthdateDay, BirthdateMonth, BirthdateYear);
      if (isValid) {
        console.log('User is eligible.');
      } else {
        showToast('Error', 'Please enter a valid age.', 'Error');
        console.log('User is not eligible.');
        return;
      }

      const DataToSend = {
        eventName: 'update_profile',
        mobile_no: profile?.mobile_no,
        about: Bio || profile?.about,
        identity: UserData?.identity || UserData.email,
        profile_image: profile?.profile_image,
        full_name: UserName,
        birthdate:
          `${BirthdateDay || '00'}/${BirthdateMonth || '00'}/${
            BirthdateYear || '0000'
          }` || profile?.birthdate,
        gender: profile?.gender,
        city: City,
        orientation: profile?.orientation,
        is_orientation_visible: profile?.is_orientation_visible,
        hoping: profile?.hoping,
        education: {
          digree: EducationDegree || profile?.education?.digree,
          college_name: CollegeName || profile?.education?.college_name,
        },
        habits: {
          exercise: profile?.habits?.exercise,
          smoke: profile?.habits?.smoke,
          movies: profile?.habits?.movies,
          drink: profile?.habits?.drink,
        },
        magical_person: {
          communication_stry: profile?.magical_person?.communication_stry,
          recived_love: profile?.magical_person?.recived_love,
          education_level: profile?.magical_person?.education_level,
          star_sign: profile?.magical_person?.star_sign,
        },
        likes_into: profile?.likes_into,
        is_block_contact: profile?.is_block_contact,
        latitude: UserData?.latitude,
        longitude: UserData?.longitude,
        radius: profile?.radius,
        setting_active_status: profile?.setting_active_status || true,
        setting_age_range_min: profile?.setting_age_range_min || '18-35',
        setting_distance_preference:
          profile?.setting_distance_preference || '20',
        setting_notification_email: profile?.setting_notification_email || true,
        setting_notification_push: profile?.setting_notification_push || true,
        setting_notification_team: profile?.setting_notification_team || true,
        setting_people_with_range: profile?.setting_people_with_range || true,
        setting_show_me: profile?.setting_show_me || 'Everyone',
        setting_show_people_with_range:
          profile?.setting_show_people_with_range || true,
      };

      console.log('DataToSend', DataToSend);
      const APIResponse = await UserService.UserRegister(DataToSend);

      if (APIResponse.code === 200) {
        GetProfileData();
        showToast(
          'Profile Updated',
          'Your profile information has been successfully updated.',
          'success',
        );
      } else {
        showToast(
          'Error Updating Profile',
          'Oops! Something went wrong while trying to update your profile. Please try again later or contact support if the issue persists',
          'error',
        );
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log('Something went wrong edit profile :--:>', error);
      showToast('Error', String(error), 'Error');
    } finally {
      setIsFetchDataAPILoading(false);
    }
  };

  const storeViewPosition = (viewName: string, position: number) => {
    console.log('STORING:', viewName, position);
    setViewPositions(prevState => ({
      ...prevState,
      [viewName]: position,
    }));
  };

  return (
    <View style={styles.Container}>
      <ProfileAndSettingHeader
        Title={'Edit Profile'}
        onUpdatePress={onUpdateProfile}
        isLoading={IsFetchDataAPILoading}
      />
      {/* <ProfileAndSettingHeader Title={'Edit Profile'} /> */}
      <ScrollView bounces={false} style={styles.ContentView}>
        <View style={styles.ListSubView}>
          {/* Name View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.ProfileTab}
              Title="Name"
            />
            <EditProfileBoxView
              value={UserName}
              withTextInput
              children={<></>}
              onChangeText={setUserName}
              maxLength={20}
              TextInputContainerStyle={{justifyContent: 'center'}}
              TextInputStyle={[styles.UserFullNameStyle, {}]}
              IsViewLoading={IsFetchDataAPILoading}
              PlaceholderText="What's your full name?"
            />
            {/* <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <Text style={styles.UserFullNameStyle}>
                {profile?.full_name || 'User'}
              </Text>
            </EditProfileBoxView> */}
          </View>

          {/* Age View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.birthday_icon}
              Title="Birthday"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <View style={styles.BirthDateContainerView}>
                <CustomTextInput
                  ref={dayInputRef}
                  editable={true}
                  keyboardType={'number-pad'}
                  value={BirthdateDay}
                  cursorColor={COLORS.Primary}
                  defaultValue={profile?.birthdate?.split('/')[0]}
                  // onChangeText={value =>
                  //   handleTextInputChange(
                  //     value,
                  //     setBirthdateDay,
                  //     2,
                  //     monthInputRef,
                  //   )
                  // }
                  onChangeText={value => {
                    // Allow the user to remove the input
                    if (
                      value === '' ||
                      (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 31)
                    ) {
                      setBirthdateDay(value);
                      if (value.length === 2) {
                        // Move focus to the next input field
                        monthInputRef?.current?.focus();
                      }
                    }
                  }}
                  maxLength={2}
                  placeholder="DD"
                  style={[styles.BirthDateInputStyle]}
                  placeholderTextColor={COLORS.Gray}
                />
                <CustomTextInput
                  ref={monthInputRef}
                  value={BirthdateMonth}
                  editable={true}
                  keyboardType={'number-pad'}
                  cursorColor={COLORS.Primary}
                  defaultValue={profile?.birthdate?.split('/')[1]}
                  // onChangeText={value =>
                  //   handleTextInputChange(
                  //     value,
                  //     setBirthdateMonth,
                  //     2,
                  //     yearInputRef,
                  //   )
                  // }
                  onChangeText={value => {
                    // Allow the user to remove the input
                    if (
                      value === '' ||
                      (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 12)
                    ) {
                      setBirthdateMonth(value);
                      if (value.length === 2) {
                        // Move focus to the next input field
                        yearInputRef?.current?.focus();
                      }
                    }
                  }}
                  maxLength={2}
                  placeholder="MM"
                  style={[styles.BirthDateInputStyle]}
                  placeholderTextColor={COLORS.Gray}
                />
                <CustomTextInput
                  ref={yearInputRef}
                  editable={true}
                  value={BirthdateYear}
                  cursorColor={COLORS.Primary}
                  defaultValue={profile?.birthdate?.split('/')[2]}
                  keyboardType={'number-pad'}
                  onChangeText={value =>
                    handleTextInputChange(
                      value,
                      setBirthdateYear,
                      4,
                      yearInputRef,
                    )
                  }
                  maxLength={4}
                  placeholder="YYYY"
                  style={[styles.BirthDateInputStyle]}
                  placeholderTextColor={COLORS.Gray}
                />
              </View>
            </EditProfileBoxView>
          </View>

          {/* Media View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.media_icon}
              Title="Media"
            />

            <FlatList
              data={UserPicks}
              numColumns={3}
              renderItem={({item, index}) => {
                return (
                  <EditProfileAllImageView
                    item={item}
                    index={index}
                    showToast={showToast}
                    setUserPicks={setUserPicks}
                    UserPicks={UserPicks}
                    OnToggleModal={OnToggleModal}
                    isLoading={IsFetchDataAPILoading}
                  />
                );
              }}
            />
          </View>

          {/* About me View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.about_me_icon}
              Title="About me"
            />
            <EditProfileBoxView
              value={Bio}
              withTextInput
              children={<></>}
              onChangeText={setBio}
              maxLength={500}
              IsViewLoading={IsFetchDataAPILoading}
              TextInputChildren={
                <Text
                  style={styles.TotalWordCount}>{`${Bio?.length}/500`}</Text>
              }
              PlaceholderText="Write something about you..."
            />
          </View>

          {/* Gender View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.gender_icon}
              Title="Gender"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="Your gender?"
                Item={
                  profile?.gender
                    ? Array.isArray(profile?.gender)
                      ? profile?.gender
                      : [profile?.gender]
                    : []
                }
                onPress={() => handlePresentModalPress('Gender')}
              />
            </EditProfileBoxView>
          </View>

          {/* I’m from View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.location_icon}
              Title="I’m from"
            />
            <EditProfileBoxView
              value={City}
              withTextInput
              children={<></>}
              onChangeText={setCity}
              maxLength={20}
              TextInputContainerStyle={{justifyContent: 'center'}}
              TextInputStyle={styles.UserFullNameStyle}
              IsViewLoading={IsFetchDataAPILoading}
              PlaceholderText="Where are you from?"
            />
            {/* <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <Text style={styles.UserFullNameStyle}>
                {profile?.city || 'Not Added Yet'}
              </Text>
            </EditProfileBoxView> */}
          </View>

          {/* I like View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.i_like_icon}
              Title="I like"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="What you like?"
                Item={
                  profile?.likes_into && Array.isArray(profile?.likes_into)
                    ? profile?.likes_into?.filter(item => item.trim() !== '')
                    : [profile?.likes_into || []]
                }
                onPress={() => handlePresentModalPress('ImInto')}
              />
            </EditProfileBoxView>
          </View>

          {/* Looking for View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.looking_for_icon}
              Title="Looking for"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="Add what you looking for"
                Item={
                  profile?.hoping && Array.isArray(profile?.hoping)
                    ? profile?.hoping?.filter(item => item.trim() !== '')
                    : [profile?.hoping || []]
                }
                onPress={() => handlePresentModalPress('LookingFor')}
              />
            </EditProfileBoxView>
          </View>

          {/* Interested in View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.interested_in_icon}
              Title="Interested in"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="What's your Interest?"
                Item={
                  profile?.orientation
                    ? Array.isArray(profile?.orientation)
                      ? profile?.orientation
                      : [profile?.orientation]
                    : []
                }
                onPress={() => handlePresentModalPress('InterestedIn')}
              />
            </EditProfileBoxView>
          </View>

          {/* Zodiac sign View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.zodiac_sign_icon}
              Title="Zodiac sign"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="Add Your Zodiac Sign"
                Item={
                  profile?.magical_person?.star_sign
                    ? Array.isArray(profile?.magical_person?.star_sign)
                      ? profile?.magical_person?.star_sign
                      : [profile?.magical_person?.star_sign]
                    : []
                }
                onPress={() => handlePresentModalPress('ZodiacSign')}
              />
            </EditProfileBoxView>
          </View>

          {/* Education View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.education_icon}
              Title="Education"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <View>
                <View style={styles.EducationInputView}>
                  <Text style={styles.EducationTitleText}>
                    My education degree is
                  </Text>
                  <CustomTextInput
                    value={CollegeName}
                    cursorColor={COLORS.Primary}
                    defaultValue={CollegeName}
                    onChangeText={setCollegeName}
                    placeholder="Enter your education degree"
                    style={styles.YourEducationTextStyle}
                    placeholderTextColor={COLORS.Gray}
                  />
                </View>
                <View style={styles.EducationInputView}>
                  <Text style={styles.EducationTitleText}>
                    My college name is
                  </Text>
                  <CustomTextInput
                    value={EducationDegree}
                    defaultValue={EducationDegree}
                    cursorColor={COLORS.Primary}
                    onChangeText={setEducationDegree}
                    placeholder="Enter your college name"
                    style={styles.YourEducationTextStyle}
                    placeholderTextColor={COLORS.Gray}
                  />
                </View>
              </View>
            </EditProfileBoxView>
          </View>

          {/* Communication style View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.communication_style_icon}
              Title="Communication style"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="Add Communication Style"
                Item={
                  profile?.magical_person?.communication_stry
                    ? Array.isArray(profile?.magical_person?.communication_stry)
                      ? profile?.magical_person?.communication_stry
                      : [profile?.magical_person?.communication_stry]
                    : []
                }
                onPress={() => handlePresentModalPress('CommunicationStyle')}
              />
            </EditProfileBoxView>
          </View>

          {/* Exercise style View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.exercise_icon}
              Title="Exercise"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="How often you do Exercise?"
                Item={
                  profile?.habits?.exercise
                    ? Array.isArray(profile?.habits?.exercise)
                      ? profile?.habits?.exercise
                      : [profile?.habits?.exercise]
                    : []
                }
                onPress={() => handlePresentModalPress('Exercise')}
              />
            </EditProfileBoxView>
          </View>

          {/* Smoke & drinks style View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.smoke_and_drinks_icon}
              Title="Smoke & drinks"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="Are you into Smoke & drinks?"
                Item={
                  profile?.habits?.smoke
                    ? Array.isArray(profile?.habits?.smoke)
                      ? profile?.habits?.smoke
                      : [profile?.habits?.smoke]
                    : []
                }
                onPress={() => handlePresentModalPress('SmokeAndDrink')}
              />
            </EditProfileBoxView>
          </View>

          {/* Movies View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.movies_icon}
              Title="Movies"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="how often you movies?"
                Item={
                  profile?.habits?.movies
                    ? Array.isArray(profile?.habits?.movies)
                      ? profile?.habits?.movies
                      : [profile?.habits?.movies]
                    : []
                }
                onPress={() => handlePresentModalPress('Movie')}
              />
            </EditProfileBoxView>
          </View>

          {/* Drink View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.drink_icon}
              Title="Drink"
            />
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <EditProfileCategoriesList
                EmptyTitleText="What you drink dude?"
                Item={
                  profile?.habits?.drink
                    ? Array.isArray(profile?.habits?.drink)
                      ? profile?.habits?.drink
                      : [profile?.habits?.drink]
                    : []
                }
                onPress={() => handlePresentModalPress('Drink')}
              />
            </EditProfileBoxView>
          </View>
        </View>
      </ScrollView>

      <ChooseFromModal
        isModalVisible={ChooseModalVisible}
        toggleModal={OnToggleModal}
        OnOptionPress={(option: string) => {
          console.log('option', option);
          HandleUserSelection(option);
        }}
      />

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          enableDynamicSizing
          backgroundStyle={{
            backgroundColor: COLORS.Secondary,
          }}
          handleComponent={null}
          // enableDismissOnClose={false}
          // enableOverDrag={false}
          // enablePanDownToClose={false}
          backdropComponent={props => (
            <BlurView blurAmount={2} style={props.style}>
              <BottomSheetBackdrop
                {...props}
                // opacity={0.5}
                enableTouchThrough={false}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                style={[StyleSheet.absoluteFillObject]}
              />
            </BlurView>
          )}
          maxDynamicContentSize={Dimensions.get('screen').height - 150}
          onChange={handleSheetChanges}
          style={{
            borderRadius: 0,
          }}
          containerStyle={{
            borderRadius: 0,
          }}>
          <View style={{flex: 1}}>
            <View style={styles.CloseViewContainer}>
              <TouchableOpacity
                style={styles.ModalCloseIconBTN}
                onPress={() => bottomSheetModalRef?.current?.close()}
                activeOpacity={ActiveOpacity}>
                <Image
                  source={CommonIcons.CloseModal}
                  style={styles.ModalCloseIcon}
                />
              </TouchableOpacity>
              {IsFetchDataAPILoading ? (
                <View style={styles.ModalSubmitButton}>
                  <ActivityIndicator size={17} color={COLORS.Primary} />
                </View>
              ) : (
                <TouchableOpacity
                  disabled={IsFetchDataAPILoading}
                  onPress={() => onUpdateProfile()}
                  style={styles.ModalSubmitButton}
                  activeOpacity={ActiveOpacity}>
                  <Image
                    source={CommonIcons.Check}
                    tintColor={COLORS.Primary}
                    style={styles.ModalSubmitIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <BottomSheetScrollView style={{}} ref={scrollViewRef}>
              <EditProfileSheetView
                profile={profile}
                setProfile={setProfile}
                viewPositions={viewPositions}
                storeViewPosition={storeViewPosition}
              />
            </BottomSheetScrollView>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  ContentView: {
    flex: 1,
    marginBottom: 10,
  },
  ListSubView: {
    width: '90%',
    alignSelf: 'center',
  },
  DetailContainerView: {
    justifyContent: 'center',
  },
  UserFullNameStyle: {
    ...GROUP_FONT.body3,
    color: COLORS.Black,
    fontSize: 15,
    fontFamily: FONTS.Medium,
    justifyContent: 'center',

    paddingVertical: Platform.OS === 'ios' ? 25 : 0,
  },
  BirthDateContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BirthDateInputStyle: {
    width: '30%',
    paddingVertical: 13,
    borderRadius: 20,
    paddingHorizontal: 25,
    textAlign: 'center',
    backgroundColor: 'rgba(234, 234, 234, 1)',
    ...GROUP_FONT.body3,
    color: COLORS.Black,
  },
  AboutMeCustomView: {
    borderRadius: 25,
    marginVertical: 5,
    // paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.White,
  },
  AboutMeTextViewStyle: {
    ...GROUP_FONT.body4,
    fontSize: 14,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
    // justifyContent: 'flex-start',
  },
  TotalWordCount: {
    paddingBottom: 5,
    textAlign: 'right',
    ...GROUP_FONT.body4,
    color: 'rgba(130, 130, 130, 1)',
    fontFamily: FONTS.Medium,
  },
  EducationInputView: {
    justifyContent: 'center',
  },
  EducationTitleText: {
    ...GROUP_FONT.h3,
    fontSize: 15,
    marginVertical: 5,
  },
  YourEducationTextStyle: {
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
    paddingVertical: 15,
    ...GROUP_FONT.body4,
    fontSize: 14,
    color: COLORS.Black,
    // fontFamily: FONTS.SemiBold,
    backgroundColor: 'rgba(234, 234, 234, 1)',
  },
  BottomSheetContainerView: {
    marginVertical: 10,
  },
  CloseViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  ModalCloseIconBTN: {
    flex: 1,
  },
  ModalCloseIcon: {
    width: 29,
    height: 29,
  },
  ModalSubmitButton: {
    width: 29,
    height: 29,
    borderRadius: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  ModalSubmitIcon: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
});

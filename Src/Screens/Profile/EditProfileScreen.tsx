/* eslint-disable react/no-unstable-nested-components */
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { TextInput } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS, GROUP_FONT } from '../../Common/Theme';
import CustomTextInput from '../../Components/CustomTextInput';
import { GradientBorderView } from '../../Components/GradientBorder';
import ApiConfig from '../../Config/ApiConfig';
import { TotalProfilePicCanUploadEditProfile } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { useCameraPermission } from '../../Hooks/useCameraPermission';
import { useGalleryPermission } from '../../Hooks/useGalleryPermission';
import { useLocationPermission } from '../../Hooks/useLocationPermission';
import { updateField } from '../../Redux/Action/actions';
import UserService from '../../Services/AuthService';
import { LocalStorageFields } from '../../Types/LocalStorageFields';
import type { ProfileType } from '../../Types/ProfileType';
import { getProfileData } from '../../Utils/profileUtils';
import { useCustomToast } from '../../Utils/toastUtils';
import ChooseFromModal from '../Auth/CreateProfile/Components/ChooseFromModal';

import EditProfileAllImageView from './Components/EditProfileComponents/EditProfileAllImageView';
import EditProfileBoxView from './Components/EditProfileComponents/EditProfileBoxView';
import EditProfileCategoriesList from './Components/EditProfileComponents/EditProfileCategoriesList';
import EditProfileSheetView from './Components/EditProfileComponents/EditProfileSheetView';
import EditProfileTitleView from './Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from './Components/profile-and-setting-header';

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

const calculateAge = (inputDate: any) => {
  const [day, month, year] = inputDate.split(',').map((item: any) => parseInt(item.trim(), 10));

  if (month < 1 || month > 12) {
    throw new Error('Invalid month. Month must be between 1 and 12.');
  }

  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const isEligible = (age: number) => {
  return age >= 18 && age < 100;
};

function EditProfileScreen() {
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();

  const dayInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const userData = useSelector((state: any) => state?.user);

  const { requestCameraPermission } = useCameraPermission();
  const { requestGalleryPermission } = useGalleryPermission();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileType>(userData?.userData || '');
  const [chooseModalVisible, setChooseModalVisible] = useState(false);
  const [bio, setBio] = useState(profile?.about || '');
  const [userName, setUserName] = useState(profile?.full_name || '');
  const [city, setCity] = useState(profile?.city || '');
  const [collegeName, setCollegeName] = useState(profile?.education?.college_name || '');
  const [educationDegree, setEducationDegree] = useState(profile?.education?.digree || '');

  const day = useMemo(() => {
    return profile?.birthdate?.split('/')[0];
  }, [profile]);

  const month = useMemo(() => {
    return profile?.birthdate?.split('/')[1];
  }, [profile]);

  const year = useMemo(() => {
    return profile?.birthdate?.split('/')[2];
  }, [profile]);

  const [BirthdateDay, setBirthdateDay] = useState(day);
  const [BirthdateMonth, setBirthdateMonth] = useState(month);
  const [BirthdateYear, setBirthdateYear] = useState(year);
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

  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [UserPicks, setUserPicks] = useState(
    Array.from({ length: TotalProfilePicCanUploadEditProfile }, (_, index) => ({
      name: '',
      type: '',
      key: String(index),
      url: '',
    })),
  );

  const { locationPermission, requestLocationPermission } = useLocationPermission();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { isConnected } = await NetInfo.fetch();
      const localData = userData?.userData;

      if (isConnected) {
        await checkLocationPermission();
        const updatedPicks = Array.from(
          { length: TotalProfilePicCanUploadEditProfile },
          (_, index) => ({
            name: '',
            type: '',
            key: String(index),
            url: localData?.recent_pik?.[index] || '',
          }),
        );

        setUserPicks(updatedPicks);
        if (!localData || !localData?._id || !localData?.full_name) {
          setIsLoading(true);
          await fetchProfileData();
          await getProfileData();
        }
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInputChange = (
    value: string,
    setValueFunc: (value: string) => void,
    maxLength: number,
    nextInputRef: any,
  ) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setValueFunc(numericValue);

    if (numericValue.length === maxLength && nextInputRef) {
      nextInputRef.current.focus();
    }
  };

  const checkLocationPermission = async () => {
    if (!locationPermission) {
      const requestPermission = await requestLocationPermission();
      if (!requestPermission) {
        return;
      }
    }

    storeLocationPermission();
  };

  const storeLocationPermission = async () => {
    try {
      return await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async position => {
            const { coords } = position;
            if (coords) {
              await Promise.all([
                dispatch(updateField(LocalStorageFields.longitude, coords.longitude)),
                dispatch(updateField(LocalStorageFields.latitude, coords.latitude)),
              ]);
            }
          },
          error => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
      });
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const userDataForApi = { eventName: 'get_profile' };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200 && APIResponse?.data) {
        const data: ProfileType = APIResponse?.data;

        if (!data.magical_person || Object.keys(data.magical_person).length === 0) {
          data.magical_person = {
            communication_stry: '',
            education_level: '',
            recived_love: '',
            star_sign: '',
          };
        }

        if (!data?.habits || Object.keys(data?.habits).length === 0) {
          data.habits = {
            drink: '',
            exercise: '',
            movies: '',
            smoke: '',
          };
        }

        setProfile(data || {});
        setBio(data?.about || '');
        setUserName(data?.full_name || '');
        setCity(data?.city || '');
        setCollegeName(data?.education?.college_name || '');
        setEducationDegree(data?.education?.digree || '');
        setBirthdateDay(data?.birthdate?.split('/')?.[0] || '');
        setBirthdateMonth(data?.birthdate?.split('/')?.[1] || '');
        setBirthdateYear(data?.birthdate?.split('/')?.[2] || '');

        if (data?.recent_pik?.length !== 0) {
          data?.recent_pik?.forEach((res, index) => {
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
      } else {
        setProfile({} as ProfileType);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const handlePresentModalPress = useCallback((name: string) => {
    bottomSheetModalRef.current?.present();
    setSelectedCategoryName(name);
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (
        index === 0 &&
        viewPositions[selectedCategoryName as keyof typeof viewPositions] !== undefined
      ) {
        scrollViewRef.current?.scrollTo({
          x: 0,
          y: viewPositions[selectedCategoryName as keyof typeof viewPositions],
          animated: true,
        });
      }
    },
    [selectedCategoryName, viewPositions, bottomSheetModalRef, scrollViewRef],
  );

  const onToggleModal = () => {
    setChooseModalVisible(!chooseModalVisible);
  };

  const handleGalleryImagePicker = async () => {
    try {
      const res = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit:
          TotalProfilePicCanUploadEditProfile - UserPicks.filter(item => item.url !== '').length,
      });

      const newImages =
        res?.assets?.map((image, index) => ({
          name: image.fileName || '',
          type: image.type || '',
          key: `${Date.now()}-${index}`,
          url: image.uri || '',
        })) || [];

      if (newImages.length > 0) {
        uploadImage(newImages);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message), 'error');
    }
  };

  const handleCameraImagePicker = async () => {
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
        uploadImage(newImages);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message), 'error');
    }
  };

  const handleUserSelection = async (selectedOption: string) => {
    try {
      const permissionStatus =
        selectedOption === 'Camera'
          ? await requestCameraPermission()
          : await requestGalleryPermission();

      if (
        Platform.OS === 'android'
          ? permissionStatus
          : selectedOption !== 'Camera'
          ? true
          : permissionStatus
      ) {
        if (selectedOption === 'Camera') {
          await handleCameraImagePicker();
        } else {
          await handleGalleryImagePicker();
        }

        setChooseModalVisible(false);
      }
    } catch (error: any) {
      console.error('Error handling user selection:', error);
    }
  };

  const uploadImage = async (items: any[]) => {
    setIsLoading(true);

    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );

      setIsLoading(false);

      return;
    }

    try {
      const uploadResults = [];

      for (const { url, type, name } of items) {
        if (url && typeof url === 'string') {
          const formData = new FormData();
          formData.append('eventName', 'update_profile');
          formData.append('file_to', 'profile_images');
          formData.append('file', {
            uri: Platform.OS === 'android' ? url : url.replace('file://', ''),
            type,
            name,
          });

          const response = await axios.post(ApiConfig.IMAGE_UPLOAD_BASE_URL, formData, {
            headers: {
              Authorization: `Bearer ${userData.Token}`,
              app_secret: '_d_a_t_i_n_g_',
              'Content-Type': 'multipart/form-data',
            },
          });

          uploadResults.push(response.data);
        } else {
          console.error('Invalid URL:', url);
        }
      }

      const allUploadsSuccessful = uploadResults.every(result => result?.code === 200);

      if (allUploadsSuccessful) {
        fetchProfileData();
        getProfileData();
        showToast('Image Uploaded', 'Your images have been uploaded successfully.', 'success');
      } else {
        showToast(TextString.error.toUpperCase(), 'Error while uploading images', 'error');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateProfile = async () => {
    const isInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!isInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );

      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    try {
      const age = calculateAge(`${BirthdateDay},${BirthdateMonth},${BirthdateYear}`);
      const isValid = isEligible(age);

      if (!isValid) {
        showToast(TextString.error.toUpperCase(), 'Please enter a valid age.', 'error');

        return;
      }

      const DataToSend = {
        eventName: 'update_profile',
        mobile_no: profile?.mobile_no,
        about: bio || profile?.about,
        identity: userData?.identity || userData.email,
        profile_image: profile?.profile_image,
        full_name: userName,
        birthdate:
          `${BirthdateDay || '00'}/${BirthdateMonth || '00'}/${BirthdateYear || '0000'}` ||
          profile?.birthdate,
        gender: profile?.gender,
        city,
        orientation: profile?.orientation,
        is_orientation_visible: profile?.is_orientation_visible,
        hoping: profile?.hoping,
        education: {
          digree: educationDegree || profile?.education?.digree,
          college_name: collegeName || profile?.education?.college_name,
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
        latitude: userData?.latitude,
        longitude: userData?.longitude,
        radius: profile?.radius,
        setting_active_status: profile?.setting_active_status || true,
        setting_age_range_min: profile?.setting_age_range_min || '18-35',
        setting_distance_preference: profile?.setting_distance_preference || '20',
        setting_notification_email: profile?.setting_notification_email || true,
        setting_notification_push: profile?.setting_notification_push || true,
        setting_notification_team: profile?.setting_notification_team || true,
        setting_people_with_range: profile?.setting_people_with_range || true,
        setting_show_me: profile?.setting_show_me || 'Everyone',
        setting_show_people_with_range: profile?.setting_show_people_with_range || true,
      };

      const APIResponse = await UserService.UserRegister(DataToSend);

      if (APIResponse.code === 200) {
        showToast(
          'Profile Updated',
          'Your profile information has been successfully updated.',
          'success',
        );

        fetchProfileData();
        getProfileData();

        setIsLoading(false);
      } else {
        showToast(
          'Error Updating Profile',
          'Oops! Something went wrong while trying to update your profile. Please try again later or contact support if the issue persists',
          'error',
        );

        setIsLoading(false);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message), 'Error');
      setIsLoading(false);
    }
  };

  const storeViewPosition = (viewName: string, position: number) => {
    setViewPositions(prevState => ({
      ...prevState,
      [viewName]: position,
    }));
  };

  const onSheetClose = useCallback(() => {
    if (!bottomSheetModalRef?.current) {
      return;
    }

    bottomSheetModalRef?.current.dismiss();
  }, []);

  return (
    <GradientView>
      <View style={styles.Container}>
        <ProfileAndSettingHeader
          Title="Edit Profile"
          onUpdatePress={onUpdateProfile}
          isLoading={isLoading}
        />
        <ScrollView
          bounces={false}
          style={styles.ContentView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchProfileData();
                getProfileData();
              }}
              progressBackgroundColor={colors.White}
              colors={[colors.Primary]}
            />
          }
        >
          <View style={styles.ListSubView}>
            <View style={styles.detailContainerView}>
              <EditProfileTitleView isIcon={true} Icon={CommonIcons.LightProfileTab} Title="Name" />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView
                  withTextInput
                  maxLength={20}
                  children={<></>}
                  onChangeText={setUserName}
                  value={userName?.toString() || ''}
                  IsViewLoading={isLoading}
                  PlaceholderText="What's your full name?"
                  TextInputStyle={styles.textInputTextStyle}
                  TextInputContainerStyle={{ justifyContent: 'center' }}
                />
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.birthday_icon}
                Title="Birthday"
              />

              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
                  <View style={styles.BirthDateContainerView}>
                    <CustomTextInput
                      ref={dayInputRef}
                      editable={true}
                      keyboardType="number-pad"
                      value={BirthdateDay}
                      cursorColor={colors.Primary}
                      defaultValue={profile?.birthdate?.split('/')[0]}
                      onChangeText={value => {
                        if (
                          value === '' ||
                          (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 31)
                        ) {
                          setBirthdateDay(value);
                          if (value.length === 2) {
                            monthInputRef?.current?.focus();
                          }
                        }
                      }}
                      maxLength={2}
                      placeholder="DD"
                      textAlign="center"
                      textAlignVertical="center"
                      style={[
                        styles.birthDateInputStyle,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(240, 236, 255, 1)',
                        },
                      ]}
                      placeholderTextColor={colors.Gray}
                    />
                    <CustomTextInput
                      ref={monthInputRef}
                      value={BirthdateMonth}
                      editable={true}
                      keyboardType="number-pad"
                      cursorColor={colors.Primary}
                      defaultValue={profile?.birthdate?.split('/')[1]}
                      onChangeText={value => {
                        if (
                          value === '' ||
                          (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 12)
                        ) {
                          setBirthdateMonth(value);
                          if (value.length === 2) {
                            yearInputRef?.current?.focus();
                          }
                        }
                      }}
                      maxLength={2}
                      placeholder="MM"
                      style={[
                        styles.birthDateInputStyle,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(240, 236, 255, 1)',
                        },
                      ]}
                      placeholderTextColor={colors.Gray}
                    />
                    <CustomTextInput
                      ref={yearInputRef}
                      editable={true}
                      value={BirthdateYear}
                      cursorColor={colors.Primary}
                      defaultValue={profile?.birthdate?.split('/')[2]}
                      keyboardType="number-pad"
                      onChangeText={value =>
                        handleTextInputChange(value, setBirthdateYear, 4, yearInputRef)
                      }
                      maxLength={4}
                      placeholder="YYYY"
                      style={[
                        styles.birthDateInputStyle,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(240, 236, 255, 1)',
                        },
                      ]}
                      placeholderTextColor={colors.Gray}
                    />
                  </View>
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView isIcon={true} Icon={CommonIcons.media_icon} Title="Media" />

              <FlatList
                data={UserPicks}
                numColumns={3}
                initialNumToRender={6}
                maxToRenderPerBatch={10}
                windowSize={21}
                renderItem={({ item }) => (
                  <EditProfileAllImageView
                    item={item}
                    setUserPicks={setUserPicks}
                    UserPicks={UserPicks}
                    OnToggleModal={onToggleModal}
                    isLoading={isLoading}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.about_me_icon}
                Title="About me"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView
                  value={bio}
                  withTextInput
                  children={<></>}
                  onChangeText={setBio}
                  maxLength={500}
                  IsViewLoading={isLoading}
                  TextInputStyle={[styles.textInputTextStyle, { minHeight: 80 }]}
                  TextInputChildren={
                    <Text style={styles.TotalWordCount}>{`${bio?.length}/500`}</Text>
                  }
                  PlaceholderText="Write something about you..."
                />
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView isIcon={true} Icon={CommonIcons.gender_icon} Title="Gender" />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.location_icon}
                Title="I’m from"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView
                  value={city}
                  withTextInput
                  children={<></>}
                  onChangeText={setCity}
                  maxLength={20}
                  TextInputContainerStyle={{ justifyContent: 'center' }}
                  TextInputStyle={styles.textInputTextStyle}
                  IsViewLoading={isLoading}
                  PlaceholderText="Where are you from?"
                />
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView isIcon={true} Icon={CommonIcons.i_like_icon} Title="I like" />

              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
                  <EditProfileCategoriesList
                    EmptyTitleText="What you like?"
                    Item={
                      profile?.likes_into && Array.isArray(profile?.likes_into)
                        ? profile?.likes_into?.filter(item => item.trim() !== '')
                        : profile?.likes_into || []
                    }
                    onPress={() => handlePresentModalPress('ImInto')}
                  />
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.looking_for_icon}
                Title="Looking for"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
                  <EditProfileCategoriesList
                    EmptyTitleText="Add what you looking for"
                    Item={
                      profile?.hoping && Array.isArray(profile?.hoping)
                        ? profile?.hoping?.filter(item => item.trim() !== '')
                        : [profile?.hoping?.toString()]
                    }
                    onPress={() => handlePresentModalPress('LookingFor')}
                  />
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.interested_in_icon}
                Title="Interested in"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.zodiac_sign_icon}
                Title="Zodiac sign"
              />

              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.education_icon}
                Title="Education"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
                  <View>
                    <View style={styles.EducationInputView}>
                      <Text style={[styles.EducationTitleText, { color: colors.TextColor }]}>
                        My education degree is
                      </Text>
                      <GradientBorderView
                        gradientProps={{ colors: colors.editFiledBackground }}
                        style={{
                          borderRadius: 30,
                          marginTop: 5,
                          marginBottom: 10,
                          paddingVertical: 20,
                          borderWidth: 1,
                          overflow: 'hidden',
                          backgroundColor: isDark ? '' : 'rgba(240, 236, 255, 1)',
                        }}
                      >
                        <CustomTextInput
                          value={collegeName}
                          cursorColor={colors.Primary}
                          defaultValue={collegeName}
                          onChangeText={setCollegeName}
                          placeholder="Enter your education degree"
                          style={[styles.YourEducationTextStyle, { minHeight: 45 }]}
                          placeholderTextColor={colors.Gray}
                        />
                      </GradientBorderView>
                    </View>
                    <View style={styles.EducationInputView}>
                      <Text style={[styles.EducationTitleText, { color: colors.TextColor }]}>
                        My college name is
                      </Text>
                      <GradientBorderView
                        gradientProps={{ colors: colors.editFiledBackground }}
                        style={{
                          borderRadius: 30,
                          marginTop: 5,
                          marginBottom: 10,
                          paddingVertical: 20,
                          borderWidth: 1,
                          overflow: 'hidden',
                          backgroundColor: isDark ? '' : 'rgba(240, 236, 255, 1)',
                        }}
                      >
                        <CustomTextInput
                          value={educationDegree}
                          defaultValue={educationDegree}
                          cursorColor={colors.Primary}
                          onChangeText={setEducationDegree}
                          placeholder="Enter your college name"
                          style={[styles.YourEducationTextStyle, { minHeight: 45 }]}
                          placeholderTextColor={colors.Gray}
                        />
                      </GradientBorderView>
                    </View>
                  </View>
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.communication_style_icon}
                Title="Communication style"
              />

              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.exercise_icon}
                Title="Exercise"
              />

              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView
                isIcon={true}
                Icon={CommonIcons.smoke_and_drinks_icon}
                Title="Smoke & drinks"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView isIcon={true} Icon={CommonIcons.movies_icon} Title="Movies" />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
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
              </GradientBorderView>
            </View>

            <View style={styles.detailContainerView}>
              <EditProfileTitleView isIcon={true} Icon={CommonIcons.drink_icon} Title="Drink" />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={[styles.selectionGradientView, !isDark && { backgroundColor: colors.White }]}
              >
                <EditProfileBoxView IsViewLoading={isLoading}>
                  <EditProfileCategoriesList
                    EmptyTitleText="What you drink?"
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
              </GradientBorderView>
            </View>
          </View>
        </ScrollView>

        <ChooseFromModal
          isModalVisible={chooseModalVisible}
          toggleModal={onToggleModal}
          OnOptionPress={(option: string) => {
            handleUserSelection(option);
          }}
        />

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            enableDynamicSizing
            backgroundStyle={{
              backgroundColor: !isDark ? 'rgba(240, 236, 255, 1)' : colors.sheetBackground[0],
            }}
            onDismiss={onSheetClose}
            handleComponent={null}
            backdropComponent={props => (
              <BlurView blurAmount={2} style={props.style}>
                <BottomSheetBackdrop
                  {...props}
                  enableTouchThrough={false}
                  appearsOnIndex={0}
                  disappearsOnIndex={-1}
                  style={StyleSheet.absoluteFillObject}
                />
              </BlurView>
            )}
            maxDynamicContentSize={Dimensions.get('screen').height - 150}
            onChange={handleSheetChanges}
            style={{
              borderRadius: 20,
              borderWidth: 0.5,
              width: '101%',
              borderColor: colors.Primary,
            }}
            containerStyle={{ borderRadius: 0 }}
          >
            <View style={styles.CloseViewContainer}>
              <LinearGradient style={styles.ModalCloseIconBTN} colors={colors.ButtonGradient}>
                <Pressable
                  onPress={() => bottomSheetModalRef?.current?.close()}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image source={CommonIcons.ic_cross} style={styles.ModalCloseIcon} />
                </Pressable>
              </LinearGradient>

              {isLoading ? (
                <View style={styles.ModalSubmitButton}>
                  <ActivityIndicator size={17} color={colors.Primary} />
                </View>
              ) : (
                <LinearGradient
                  style={styles.ModalSubmitButton}
                  colors={
                    isDark
                      ? ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.3)']
                      : [colors.White, colors.White]
                  }
                >
                  {isLoading ? (
                    <ActivityIndicator size={17} color={colors.Primary} />
                  ) : (
                    <Pressable
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                      }}
                      disabled={isLoading}
                      onPress={() => {
                        bottomSheetModalRef?.current && bottomSheetModalRef?.current?.close();
                        setIsLoading(true);

                        setTimeout(() => {
                          onUpdateProfile();
                        }, 100);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Image
                        source={CommonIcons.Check}
                        tintColor={isDark ? 'rgba(255, 255, 255, 0.3)' : colors.Primary}
                        style={styles.ModalSubmitIcon}
                      />
                    </Pressable>
                  )}
                </LinearGradient>
              )}
            </View>
            <BottomSheetScrollView ref={scrollViewRef}>
              <EditProfileSheetView
                profile={profile}
                setProfile={setProfile}
                viewPositions={viewPositions}
                storeViewPosition={storeViewPosition}
              />
            </BottomSheetScrollView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GradientView>
  );
}

export default memo(EditProfileScreen);

const styles = StyleSheet.create({
  BirthDateContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  CloseViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  Container: {
    flex: 1,
  },
  ContentView: {
    flex: 1,
    marginBottom: 10,
  },
  EducationInputView: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  EducationTitleText: {
    ...GROUP_FONT.h3,
    fontSize: 15,
    marginVertical: 5,
  },
  ListSubView: {
    alignSelf: 'center',
    width: '90%',
  },
  ModalCloseIcon: {
    height: 13,
    width: 13,
  },
  ModalCloseIconBTN: {
    alignItems: 'center',
    borderRadius: 500,
    height: 29,
    justifyContent: 'center',
    width: 29,
  },
  ModalSubmitButton: {
    alignSelf: 'center',
    borderRadius: 500,
    height: 29,
    justifyContent: 'center',
    width: 29,
  },
  ModalSubmitIcon: {
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },

  YourEducationTextStyle: {
    textAlign: 'center',
    ...GROUP_FONT.body4,
    borderRadius: 20,
    fontSize: 14,
    overflow: 'hidden',
  },
  birthDateInputStyle: {
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 25,
    textAlign: 'center',
    width: '30%',
  },
  detailContainerView: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectionGradientView: {
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    marginVertical: 5,
    overflow: 'hidden',
  },
  textInputTextStyle: {
    ...GROUP_FONT.body3,
    fontFamily: FONTS.Medium,
    fontSize: 15,
    overflow: 'hidden',
  },
});

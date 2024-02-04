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
  Dimensions,
  FlatList,
  Image,
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
  const [Bio, setBio] = useState(profile?.bio);
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

  useEffect(() => {
    const CheckConnection = async () => {
      try {
        const IsNetOn = await NetInfo.fetch().then(info => info.isConnected);
        if (IsNetOn) {
          setIsFetchDataAPILoading(true);
          await GetProfileData();
          await CheckLocationPermission();
          setIsInternetConnected(true);
        } else {
          setIsInternetConnected(false);
        }
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
            console.log('coords', coords);
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
          : [];
        setProfile(APIResponse.data);
        setBio(DataToStore.bio);
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
        console.log('GetProfileData Data:', APIResponse.data);
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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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
        const newData = UserPicks.map(item =>
          item.url === '' ? newImages.shift() || item : item,
        );
        setUserPicks(newData);
        console.log('Selected Images:', newData);
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
        const newData = UserPicks.map(item =>
          item.url === '' ? newImages.shift() || item : item,
        );
        setUserPicks(newData);
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

  //* Upload Single Image
  // const UploadImage = async (item: any) => {
  //   console.log('item', item);
  //   let formData = new FormData();
  //   item &&
  //     item.forEach(({url, type, name}: any) => {
  //       formData.append('images', {
  //         uri: Platform.OS === 'android' ? url : url.replace('file://', ''),
  //         type,
  //         name,
  //       });
  //     });

  //   // try {
  //   //   const APIResponse = await ProfileService.AddUserImage(formData);
  //   //   console.log('UploadImage APIResponse :--:>', APIResponse);

  //   //   if (APIResponse.status) {
  //   //     const newData = UserPicks.map(data =>
  //   //       data.url === '' ? item.shift() || data : data,
  //   //     );

  //   //     setUserPicks(newData);
  //   //   } else {
  //   //     showToast(
  //   //       'Error',
  //   //       'Sorry! cant delete this image right now. try again',
  //   //       'error',
  //   //     );
  //   //     return false;
  //   //   }
  //   // } catch (error) {
  //   //   console.log('Error on image upload :--:>', error);
  //   //   showToast('Error!', String(error), 'error');
  //   // }
  // };

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

      const DataToSend = {
        eventName: 'update_profile',
        mobile_no: profile?.mobile_no,
        identity: profile?.identity,
        profile_image: profile?.profile_image,
        full_name: profile?.full_name,
        birthdate:
          `${BirthdateDay || '00'}/${BirthdateMonth || '00'}/${
            BirthdateYear || '0000'
          }` || profile?.birthdate,
        gender: profile?.gender,
        city: profile?.city,
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
      };

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
    } finally {
      setIsFetchDataAPILoading(false);
    }
  };

  return (
    <View style={styles.Container}>
      <ProfileAndSettingHeader
        Title={'Edit Profile'}
        onUpdatePress={onUpdateProfile}
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
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <Text style={styles.UserFullNameStyle}>
                {profile?.full_name || 'User'}
              </Text>
            </EditProfileBoxView>
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
                  onChangeText={value =>
                    handleTextInputChange(
                      value,
                      setBirthdateDay,
                      2,
                      monthInputRef,
                    )
                  }
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
                  onChangeText={value =>
                    handleTextInputChange(
                      value,
                      setBirthdateMonth,
                      2,
                      yearInputRef,
                    )
                  }
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
            <View style={styles.AboutMeCustomView}>
              <TextInput
                multiline
                value={Bio}
                defaultValue={Bio}
                editable={true}
                cursorColor={COLORS.Primary}
                onChangeText={setBio}
                style={styles.AboutMeTextViewStyle}
                placeholderTextColor={COLORS.Placeholder}
                placeholder="Write something about you..."
              />
              <Text style={styles.TotalWordCount}>{'454/500'}</Text>
            </View>
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
                onPress={() => handlePresentModalPress()}
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
            <EditProfileBoxView IsViewLoading={IsFetchDataAPILoading}>
              <Text style={styles.UserFullNameStyle}>
                {profile?.city || 'Not Added Yet'}
              </Text>
            </EditProfileBoxView>
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
                onPress={() => handlePresentModalPress()}
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
              <TouchableOpacity
                onPress={() => onUpdateProfile()}
                style={styles.ModalSubmitButton}
                activeOpacity={ActiveOpacity}>
                <Image
                  source={CommonIcons.Check}
                  tintColor={COLORS.Primary}
                  style={styles.ModalSubmitIcon}
                />
              </TouchableOpacity>
            </View>
            <BottomSheetScrollView>
              <EditProfileSheetView profile={profile} setProfile={setProfile} />
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
  DetailContainerView: {},
  UserFullNameStyle: {
    ...GROUP_FONT.body3,
    color: COLORS.Black,
    fontSize: 15,
    fontFamily: FONTS.Medium,
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

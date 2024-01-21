/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import CommonIcons from '../../Common/CommonIcons';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import CustomTextInput from '../../Components/CustomTextInput';
import {
  DummyImage,
  TotalProfilePicCanUploadEditProfile,
} from '../../Config/Setting';
import {useCameraPermission} from '../../Hooks/useCameraPermission';
import {useGalleryPermission} from '../../Hooks/useGalleryPermission';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import ChooseFromModal from '../Auth/CreateProfile/Components/ChooseFromModal';
import EditProfileAllImageView from './Components/EditProfileComponents/EditProfileAllImageView';
import EditProfileBoxView from './Components/EditProfileComponents/EditProfileBoxView';
import EditProfileCategoriesList from './Components/EditProfileComponents/EditProfileCategoriesList';
import EditProfileSheetView from './Components/EditProfileComponents/EditProfileSheetView';
import EditProfileTitleView from './Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from './Components/ProfileAndSettingHeader';
const initialProfileState: ProfileType = {
  _id: '',
  birthdate: '',
  city: '',
  date: 0,
  education: {college_name: '', digree: ''},
  enable: 0,
  full_name: null,
  gender: '',
  habits: {drink: '', exercise: '', movies: '', smoke: ''},
  hoping: '',
  identity: '',
  is_block_contact: '',
  is_orientation_visible: false,
  likes_into: '',
  location: {coordinates: [0, 0], type: ''},
  login_type: '',
  magical_person: {
    communication_stry: '',
    education_level: '',
    recived_love: '',
    star_sign: '',
  },
  mobile_no: '',
  orientation: [],
  profile_image: '',
  radius: 0,
  recent_pik: [],
  user_from: '',
};

const EditProfileScreen = () => {
  const dayInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const [ChooseModalVisible, setChooseModalVisible] = useState<boolean>(false);
  const {requestCameraPermission} = useCameraPermission();
  const {requestGalleryPermission} = useGalleryPermission();

  const [UserPicks, setUserPicks] = useState(
    Array.from({length: TotalProfilePicCanUploadEditProfile}, (_, index) => ({
      name: '',
      type: '',
      key: String(index),
      url: DummyImage,
    })),
  );

  console.log('UserPicks', UserPicks);

  const [profile, setProfile] = useState<ProfileType>(initialProfileState);

  useLayoutEffect(() => {
    GetProfileData();
  }, []);

  const GetProfileData = async () => {
    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setProfile(APIResponse.data);
        console.log('GetProfileData Data:', APIResponse.data);
      } else {
        setProfile({} as ProfileType);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
    }
  };

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
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

  return (
    <View style={styles.Container}>
      <ProfileAndSettingHeader Title={'Edit Profile'} />
      <ScrollView bounces={false} style={styles.ContentView}>
        <View style={styles.ListSubView}>
          {/* Name View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.ProfileTab}
              Title="Name"
            />
            <EditProfileBoxView>
              <Text style={styles.UserFullNameStyle}>
                {profile.full_name ?? 'User'}
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
            <EditProfileBoxView>
              <View style={styles.BirthDateContainerView}>
                <CustomTextInput
                  ref={dayInputRef}
                  editable={false}
                  keyboardType={'number-pad'}
                  // value={BirthDateDD}
                  onChangeText={value => {
                    // setBirthDateDD(value);
                    // handleTextChange(value, monthInputRef);
                  }}
                  maxLength={2}
                  placeholder="DD"
                  style={[styles.BirthDateInputStyle]}
                  placeholderTextColor={COLORS.Gray}
                />
                <CustomTextInput
                  ref={monthInputRef}
                  // value={BirthDateMM}
                  editable={false}
                  keyboardType={'number-pad'}
                  onChangeText={value => {
                    // setBirthDateMM(value);
                    // handleTextChange(value, yearInputRef);
                  }}
                  maxLength={2}
                  placeholder="MM"
                  style={[styles.BirthDateInputStyle]}
                  placeholderTextColor={COLORS.Gray}
                />
                <CustomTextInput
                  ref={yearInputRef}
                  editable={false}
                  // value={BirthDateYYYY}
                  keyboardType={'number-pad'}
                  onChangeText={value => {
                    // setBirthDateYYYY(value);
                  }}
                  maxLength={4}
                  placeholder="YYYY"
                  style={[styles.BirthDateInputStyle]}
                  placeholderTextColor={COLORS.Gray}
                />
              </View>
              {/* <Text>Hello</Text> */}
            </EditProfileBoxView>
          </View>

          {/* Media View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.birthday_icon}
              Title="Media"
            />

            <FlatList
              data={UserPicks}
              numColumns={3}
              renderItem={({item, index}) => {
                console.log('item', item);
                return (
                  <EditProfileAllImageView
                    item={item}
                    index={index}
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
                editable={false}
                // numberOfLines={10}
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
              Icon={CommonIcons.about_me_icon}
              Title="Gender"
            />
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.gender)
                    ? profile.gender
                    : [profile.gender]
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
            <EditProfileBoxView>
              <Text style={styles.UserFullNameStyle}>
                {profile.city ?? 'Somewhere'}
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
            <EditProfileBoxView>
              <EditProfileCategoriesList
                // Item={['Man', 'Woman', 'Any', 'cd', '123', '51cd']}
                Item={
                  Array.isArray(profile.likes_into)
                    ? profile.likes_into
                    : [profile.likes_into]
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
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.gender)
                    ? profile.gender
                    : [profile.gender]
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
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.gender)
                    ? profile.gender
                    : [profile.gender]
                }
                onPress={() => handlePresentModalPress()}
              />
            </EditProfileBoxView>
          </View>

          {/* Zodiac sign View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.interested_in_icon}
              Title="Zodiac sign"
            />
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.magical_person.star_sign)
                    ? profile.magical_person.star_sign
                    : [profile.magical_person.star_sign]
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
            <EditProfileBoxView>
              <View>
                <View style={styles.EducationInputView}>
                  <Text style={styles.EducationTitleText}>
                    My education degree is
                  </Text>
                  <CustomTextInput
                    value={profile.education.digree}
                    defaultValue={profile.education.digree}
                    onChangeText={value => {
                      // setEducationDegree(value);
                    }}
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
                    defaultValue={profile.education.college_name}
                    value={profile.education.college_name}
                    onChangeText={value => {
                      // setEducationDegree(value);
                    }}
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
              Icon={CommonIcons.education_icon}
              Title="Communication style"
            />
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.gender)
                    ? profile.gender
                    : [profile.gender]
                }
                onPress={() => handlePresentModalPress()}
              />
            </EditProfileBoxView>
          </View>

          {/* Smoke & drinks style View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.education_icon}
              Title="Smoke & drinks"
            />
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.habits.smoke)
                    ? profile.habits.smoke
                    : [profile.habits.smoke]
                }
                onPress={() => handlePresentModalPress()}
              />
            </EditProfileBoxView>
          </View>

          {/* Movies View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.education_icon}
              Title="Movies"
            />
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.habits.movies)
                    ? profile.habits.movies
                    : [profile.habits.movies]
                }
                onPress={() => handlePresentModalPress()}
              />
            </EditProfileBoxView>
          </View>

          {/* Drink View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              isIcon={true}
              Icon={CommonIcons.education_icon}
              Title="Drink"
            />
            <EditProfileBoxView>
              <EditProfileCategoriesList
                Item={
                  Array.isArray(profile.habits.drink)
                    ? profile.habits.drink
                    : [profile.habits.drink]
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
          <BottomSheetScrollView style={{}}>
            <EditProfileSheetView profile={profile} setProfile={setProfile} />
          </BottomSheetScrollView>
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
});

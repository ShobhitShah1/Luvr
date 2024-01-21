/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {FC, useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../../Common/Theme';
import {
  CommunicationStyleData,
  LookingFor,
  MainGenders,
  MovieWatchingFrequencyData,
  SmokingDrinkingFrequencyData,
  StarSignData,
  YourIntoData,
} from '../../../../Components/Data';
import {ProfileType} from '../../../../Types/ProfileType';

const {width} = Dimensions.get('window');

interface EditProfileDataProps {
  profile: ProfileType;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
}

interface ItemProps {
  id: number;
  Title: string;
  Emoji: string;
  Icon: string;
}

const EditProfileSheetView: FC<EditProfileDataProps> = ({
  profile,
  setProfile,
}) => {
  //* ================= Hoping Functions =================
  const onPressLookingFor = useCallback(
    (item: ItemProps) => {
      //* Check if the selected item is already in the array
      const isSelected = profile.hoping.Title === item?.Title;

      //* If the selected item is already in the array, unselect it
      if (isSelected) {
        setProfile(prevState => ({
          ...prevState,
          hoping: {
            id: -1,
            Title: '',
            Emoji: '',
            Icon: '',
          },
        }));
      } else {
        //* If the selected item is not in the array, select it and unselect the previous one
        setProfile(prevState => ({
          ...prevState,
          hoping: item,
        }));
      }
    },
    [profile.hoping, setProfile],
  );

  const renderHopingView = ({item, index}: {item: any; index: number}) => {
    const Selected = profile.hoping.Title === item?.Title;
    return (
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => onPressLookingFor(item)}
        style={[
          styles.LookingForListView,
          {
            backgroundColor: Selected ? COLORS.Primary : COLORS.White,
          },
        ]}
        key={index}>
        <View style={styles.TextView}>
          <Text
            numberOfLines={2}
            style={[
              styles.LookingForText,
              {
                color: Selected ? COLORS.White : COLORS.Black,
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
              tintColor={COLORS.White}
              style={{width: hp('2.5%'), height: hp('2.5%')}}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  //* ======================= END =======================

  //* ================= I'm Into Functions =================
  const handleOptionPress = useCallback(
    (YourIntoID: number, name: string) => {
      setProfile(prevSelection => {
        if (prevSelection.likes_into.includes(name)) {
          return {
            ...prevSelection,
            likes_into: prevSelection?.likes_into?.filter(
              item => item !== name,
            ),
          };
        }

        if (prevSelection.likes_into.length >= 5) {
          return prevSelection;
        }

        return {
          ...prevSelection,
          likes_into: [...prevSelection.likes_into, name],
        };
      });
    },
    [setProfile],
  );

  const renderImIntoList = useMemo(
    () =>
      ({item}: {item: {id: number; name: string}}) => {
        const selectedOption = profile.likes_into.includes(item.name);
        return (
          <View style={styles.MultiSelectOptionContainer}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={[
                styles.MultiSelectButtonView,
                selectedOption && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(item.id, item.name)}>
              <Text
                numberOfLines={2}
                style={[
                  styles.MultiSelectCategoryText,
                  selectedOption && styles.SelectedCategoriesText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    [profile.likes_into, handleOptionPress],
  );
  //* ======================= END =======================

  //* ================= Zodiac Sign Functions =================
  const handleZodiacSignPress = useCallback(
    (name: string) => {
      setProfile(prevSelection => {
        if (prevSelection.magical_person.star_sign.includes(name)) {
          return {
            ...prevSelection,
            magical_person: {
              ...prevSelection.magical_person,
              star_sign: name,
            },
          };
        }

        if (prevSelection.magical_person.star_sign.length < 1) {
          return prevSelection;
        }

        return {
          ...prevSelection,
          magical_person: {
            ...prevSelection.magical_person,
            star_sign: name,
          },
        };
      });
    },
    [setProfile],
  );

  const renderZodiacSign = useMemo(
    () =>
      ({item}: {item: string}) => {
        const selectedOption = profile.magical_person.star_sign.includes(item);
        return (
          <View style={styles.MultiSelectOptionContainer}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              style={[
                styles.MultiSelectButtonView,
                selectedOption && styles.selectedOption,
              ]}
              onPress={() => {
                handleZodiacSignPress(item);
              }}>
              <Text
                numberOfLines={2}
                style={[
                  styles.MultiSelectCategoryText,
                  selectedOption && styles.SelectedCategoriesText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    [profile.magical_person.star_sign, handleZodiacSignPress],
  );
  //* ======================= END =======================

  return (
    <ScrollView style={styles.BottomSheetContainerView}>
      {/* Gender */}
      <View
        // onLayout={event => {
        //   const layout = event.nativeEvent.layout;
        //   console.log('View 1 height:', layout.height);
        //   console.log('View 1 width:', layout.width);
        //   console.log('View 1 x:', layout.x);
        //   console.log('View 1 y:', layout.y);
        // }}
        style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>I am a</Text>
        </View>
        <View style={styles.BirthdayInputView}>
          {MainGenders.map((gender, index) => (
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              key={index}
              onPress={() => {
                setProfile(prevState => ({
                  ...prevState,
                  gender: gender,
                }));
              }}
              style={[
                styles.GenderView,
                {
                  width: hp('12%'),
                  backgroundColor:
                    profile.gender === gender ? COLORS.Primary : COLORS.White,
                  borderWidth: profile.gender === gender ? 2 : 0,
                },
              ]}>
              <Text
                style={[
                  styles.GenderText,
                  {
                    color:
                      profile.gender === gender ? COLORS.White : COLORS.Gray,
                  },
                ]}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* I'm Into */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.ImIntoTitleFlexView}>
          <View
            style={[
              styles.TitleFlexView,
              {
                marginTop: 0,
                marginBottom: 0,
              },
            ]}>
            <Image
              resizeMode="contain"
              source={CommonIcons.interested_in_icon}
              style={styles.TitleIcon}
            />
            <Text style={styles.NameText}>I'm Into</Text>
          </View>
          <Text style={styles.NameText}>
            {`${profile.likes_into.length}/5`}
          </Text>
        </View>
        <View style={styles.BirthdayInputView}>
          <FlatList
            numColumns={3}
            data={YourIntoData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={renderImIntoList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      {/* Hoping || Looking For */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>Looking For</Text>
        </View>
        <View>
          <FlatList
            data={LookingFor}
            renderItem={renderHopingView}
            // contentContainerStyle={styles.FlatListContainer}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>

      {/* Zodiac Sign */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>Zodiac Sign</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={StarSignData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={renderZodiacSign}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      {/* Communication Style */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>Communication Style</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={CommunicationStyleData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={renderZodiacSign}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      {/* Smoke & Drink */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>Smoke & Drink</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={SmokingDrinkingFrequencyData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={renderZodiacSign}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      {/* Movie */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>Movie</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={MovieWatchingFrequencyData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={renderZodiacSign}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      {/* Drink */}
      <View style={styles.TextViewForSpace}>
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.interested_in_icon}
            style={styles.TitleIcon}
          />
          <Text style={styles.NameText}>Drink</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={SmokingDrinkingFrequencyData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={renderZodiacSign}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileSheetView;

const styles = StyleSheet.create({
  BottomSheetContainerView: {
    width: '83%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginBottom: hp('1.5%'),
  },
  NameText: {
    fontSize: hp('1.8%'),
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
  TitleFlexView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  TitleIcon: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BirthdayInputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  subTitleText: {
    fontSize: hp('1.6%'),
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
    marginTop: hp(1),
  },
  AllInputContainerView: {
    width: '100%',
    marginTop: hp('2%'),
  },
  GenderView: {
    padding: 0,
    backgroundColor: COLORS.White,
    height: hp('6.8%'),
    width: wp('85%'),
    borderRadius: SIZES.radius,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderColor: COLORS.White,
  },
  GenderText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Gray,
    fontSize: hp('1.7%'),
  },

  //* Im Into View || MultiSelect Style 3 Row Button
  MultiSelectOptionContainer: {},
  ImIntoTitleFlexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  MultiSelectButtonView: {
    width: hp('12%'),
    height: hp('6.8%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    marginVertical: hp('0.7%'),
    backgroundColor: COLORS.White,
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
    borderWidth: 2,
    borderColor: COLORS.White,
  },
  MultiSelectCategoryText: {
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
  ContainerContainerStyle: {
    width: '100%',
  },

  //* Hoping (Looking For)
  LookingForListView: {
    height: hp('6.5%'),
    width: '100%',
    // width: width - hp('8%'),
    // overflow: 'hidden',
    marginVertical: hp('0.7%'),
    alignSelf: 'center',

    backgroundColor: COLORS.White,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignContent: 'center',
  },
  TextView: {
    width: '90%',
    flexDirection: 'row',
    marginHorizontal: hp('2.8%'),
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  EmojiText: {
    ...GROUP_FONT.h1,
    textAlign: 'center',
    marginVertical: hp('0.5%'),
  },
  FlatListContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LookingForText: {
    ...GROUP_FONT.h3,
    fontSize: 12.5,
  },
});

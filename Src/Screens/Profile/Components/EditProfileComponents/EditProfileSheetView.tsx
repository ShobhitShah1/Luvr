/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, memo, useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../../Common/Theme';
import {
  CommunicationStyleData,
  ExerciseFrequencyData,
  GendersData,
  LookingFor,
  MainGenders,
  MovieWatchingFrequencyData,
  PreferredDrinkData,
  SmokingDrinkingFrequencyData,
  StarSignData,
  YourIntoData,
} from '../../../../Components/Data';
import { useTheme } from '../../../../Contexts/ThemeContext';
import { EducationType, HabitsType, LocationType, MagicalPersonType, ProfileType } from '../../../../Types/ProfileType';
import { ViewPositionsProps } from '../../EditProfileScreen';

interface EditProfileDataProps {
  profile: ProfileType;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
  storeViewPosition: (viewName: string, position: number) => void;
  viewPositions: ViewPositionsProps;
}

const EditProfileSheetView: FC<EditProfileDataProps> = ({ profile, setProfile, storeViewPosition, viewPositions }) => {
  const { colors, isDark } = useTheme();

  const StoreViewPosition = (viewName: string, position: number) => {
    setTimeout(() => {
      if (
        viewPositions.CommunicationStyle === 0 ||
        viewPositions.Drink === 0 ||
        viewPositions.ImInto === 0 ||
        viewPositions.LookingFor === 0 ||
        viewPositions.Exercise === 0 ||
        viewPositions.InterestedIn === 0 ||
        viewPositions.Movie === 0 ||
        viewPositions.SmokeAndDrink === 0 ||
        viewPositions.ZodiacSign === 0
      ) {
        storeViewPosition && storeViewPosition(viewName, position);
      }
    }, 0);
  };

  const onPressLookingFor = useCallback(
    (item: any) => {
      const isSelected = profile?.hoping === item?.Title;
      if (isSelected) {
        setProfile((prevState) => ({
          ...prevState,
          hoping: [],
        }));
      } else {
        setProfile((prevState) => ({
          ...prevState,
          hoping: [item],
        }));
      }
    },
    [profile?.hoping, setProfile]
  );

  const renderHopingView = ({ item, index }: { item: any; index: number }) => {
    const selectedOption = profile?.hoping?.includes(item) || false;

    return (
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={
          selectedOption
            ? colors.ButtonGradient
            : isDark
              ? ['transparent', 'transparent']
              : [colors.White, colors.White]
        }
        style={[
          styles.LookingForListView,
          {
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
          },
        ]}
        key={index}
      >
        <Pressable
          onPress={() => onPressLookingFor(item)}
          style={{
            flex: 1,
            justifyContent: 'center',
            borderRadius: SIZES.radius,
            overflow: 'hidden',
          }}
        >
          <View style={styles.TextView}>
            <Text
              numberOfLines={2}
              style={[
                styles.LookingForText,
                {
                  color: selectedOption && !isDark ? colors.White : colors.TextColor,
                  fontFamily: selectedOption ? FONTS.Bold : FONTS.Medium,
                },
              ]}
            >
              {item}
            </Text>
            {selectedOption && (
              <Image
                resizeMethod="auto"
                resizeMode="contain"
                source={CommonIcons.CheckMark}
                tintColor={selectedOption && !isDark ? colors.White : colors.TextColor}
                style={{ width: hp('2.5%'), height: hp('2.5%') }}
              />
            )}
          </View>
        </Pressable>
      </LinearGradient>
    );
  };

  const onPressIntrusted = useCallback(
    (data: any) => {
      setProfile((prevSelection) => {
        const currentIntrustedIn = prevSelection.orientation || [];

        if (currentIntrustedIn.includes(data)) {
          return {
            ...prevSelection,
            orientation: currentIntrustedIn.filter((item) => item !== data),
          };
        }

        if (currentIntrustedIn.length >= 5) {
          return prevSelection;
        }

        return {
          ...prevSelection,
          orientation: [...currentIntrustedIn, data],
        };
      });
    },
    [profile?.orientation, setProfile]
  );

  const renderInterested = ({ item, index }: { item: any; index: number }) => {
    const selectedOption =
      profile?.orientation && profile?.orientation?.length !== 0 ? profile?.orientation?.includes(item.name) : false;

    return (
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={
          selectedOption
            ? colors.ButtonGradient
            : isDark
              ? ['transparent', 'transparent']
              : [colors.White, colors.White]
        }
        style={[
          styles.LookingForListView,
          {
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
          },
        ]}
        key={index}
      >
        <Pressable
          onPress={() => onPressIntrusted(item?.name)}
          style={{
            flex: 1,
            justifyContent: 'center',
            borderRadius: SIZES.radius,
            overflow: 'hidden',
          }}
        >
          <View style={styles.TextView}>
            <Text
              numberOfLines={2}
              style={[
                styles.LookingForText,
                {
                  color: selectedOption && !isDark ? colors.White : colors.TextColor,
                  fontFamily: selectedOption ? FONTS.Bold : FONTS.Medium,
                },
              ]}
            >
              {item.name}
            </Text>
            {selectedOption && (
              <Image
                resizeMethod="auto"
                resizeMode="contain"
                source={CommonIcons.CheckMark}
                tintColor={selectedOption && !isDark ? colors.White : colors.TextColor}
                style={{ width: hp('2.5%'), height: hp('2.5%') }}
              />
            )}
          </View>
        </Pressable>
      </LinearGradient>
    );
  };

  const handleOptionPress = useCallback(
    (YourIntoID: number, name: string) => {
      setProfile((prevSelection) => {
        const currentLikesInto = prevSelection.likes_into || [];

        if (currentLikesInto.includes(name)) {
          return {
            ...prevSelection,
            likes_into: currentLikesInto.filter((item) => item !== name),
          };
        }

        if (currentLikesInto.length >= 5) {
          return prevSelection;
        }

        return {
          ...prevSelection,
          likes_into: [...currentLikesInto, name],
        };
      });
    },
    [setProfile]
  );

  const renderImIntoList = useMemo(
    () =>
      ({ item }: { item: { id: number; name: string } }) => {
        const selectedOption =
          profile?.likes_into && profile?.likes_into?.length !== 0 ? profile?.likes_into?.includes(item.name) : false;
        return (
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={
              selectedOption
                ? colors.ButtonGradient
                : isDark
                  ? ['transparent', 'transparent']
                  : [colors.White, colors.White]
            }
            style={[
              styles.MultiSelectButtonView,
              {
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
              },
            ]}
          >
            <Pressable
              style={{
                flex: 1,
                justifyContent: 'center',
                borderRadius: SIZES.radius,
                overflow: 'hidden',
              }}
              onPress={() => handleOptionPress(item.id, item.name)}
            >
              <Text
                numberOfLines={2}
                style={[
                  styles.MultiSelectCategoryText,
                  selectedOption && styles.SelectedCategoriesText,
                  { color: selectedOption && !isDark ? colors.White : colors.TextColor },
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          </LinearGradient>
        );
      },
    [profile?.likes_into, handleOptionPress]
  );

  const onClickChange = useCallback(
    (name: string, value: keyof (ProfileType & MagicalPersonType & EducationType & HabitsType & LocationType)) => {
      setProfile((prevProfile) => {
        if ('magical_person' in prevProfile && value in prevProfile?.magical_person) {
          return {
            ...prevProfile,
            magical_person: {
              ...prevProfile?.magical_person,
              [value]: name,
            },
          };
        } else if ('education' in prevProfile && value in prevProfile?.education) {
          return {
            ...prevProfile,
            education: {
              ...prevProfile?.education,
              [value]: name,
            },
          };
        } else if ('habits' in prevProfile && value in prevProfile?.habits) {
          return {
            ...prevProfile,
            habits: {
              ...prevProfile?.habits,
              [value]: name,
            },
          };
        } else if ('location' in prevProfile && value in prevProfile?.location) {
          return {
            ...prevProfile,
            location: {
              ...prevProfile?.location,
              [value]: name,
            },
          };
        } else {
          return {
            ...prevProfile,
            [value]: name,
          };
        }
      });
    },
    [setProfile]
  );

  const RenderSingleSelectionView = useMemo(
    () =>
      ({
        item,
        value,
      }: {
        item: string;
        value:
          | keyof ProfileType
          | keyof MagicalPersonType
          | keyof EducationType
          | keyof HabitsType
          | keyof LocationType;
      }) => {
        let selectedOption = false;

        if (value in profile) {
          selectedOption = profile[value as keyof ProfileType] === item;
        } else if ('magical_person' in profile && value in profile?.magical_person) {
          selectedOption = profile?.magical_person[value as keyof MagicalPersonType] === item;
        } else if ('education' in profile && value in profile?.education) {
          selectedOption = profile?.education[value as keyof EducationType] === item;
        } else if ('habits' in profile && value in profile?.habits) {
          selectedOption = profile?.habits[value as keyof HabitsType] === item;
        } else if ('location' in profile && value in profile?.location) {
          selectedOption = profile?.location[value as keyof LocationType] === item;
        }

        return (
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={
              selectedOption
                ? colors.ButtonGradient
                : isDark
                  ? ['transparent', 'transparent']
                  : [colors.White, colors.White]
            }
            style={[
              styles.MultiSelectButtonView,
              {
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
              },
            ]}
          >
            <Pressable style={{ flex: 1, justifyContent: 'center' }} onPress={() => onClickChange(item, value)}>
              <Text
                numberOfLines={2}
                style={[
                  styles.MultiSelectCategoryText,
                  selectedOption && styles.SelectedCategoriesText,
                  { color: selectedOption && !isDark ? colors.White : colors.TextColor },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          </LinearGradient>
        );
      },
    [profile, onClickChange]
  );

  return (
    <ScrollView style={styles.bottomSheetContainerView}>
      <View
        onLayout={(event) => {
          StoreViewPosition('Gender', event.nativeEvent.layout.y);
        }}
        style={styles.TextViewForSpace}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.gender_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>I am a</Text>
        </View>
        <View style={styles.BirthdayInputView}>
          {MainGenders.map((gender, index) => (
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={
                profile?.gender === gender
                  ? colors.ButtonGradient
                  : isDark
                    ? ['transparent', 'transparent']
                    : [colors.White, colors.White]
              }
              key={index}
              style={[
                styles.GenderView,
                {
                  width: hp('12%'),
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  setProfile((prevState) => ({ ...prevState, gender: gender }));
                }}
                style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text
                  style={[
                    styles.GenderText,
                    {
                      color: profile?.gender === gender ? colors.White : colors.TextColor,
                    },
                  ]}
                >
                  {gender}
                </Text>
              </Pressable>
            </LinearGradient>
          ))}
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('ImInto', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.ImIntoTitleFlexView}>
          <View style={[styles.TitleFlexView, { marginTop: 0, marginBottom: 0 }]}>
            <Image
              resizeMode="contain"
              tintColor={colors.TextColor}
              source={CommonIcons.i_like_icon}
              style={styles.TitleIcon}
            />
            <Text style={[styles.NameText, { color: colors.TextColor }]}>I'm Into</Text>
          </View>
          <Text style={[styles.NameText, { color: colors.TextColor }]}>{`(${
            profile?.likes_into !== undefined && profile?.likes_into?.length !== 0 ? profile?.likes_into?.length : 0
          }/5)`}</Text>
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
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('LookingFor', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.Search}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Looking For</Text>
        </View>
        <View>
          <FlatList data={LookingFor} renderItem={renderHopingView} keyExtractor={(item, index) => index.toString()} />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('IntrustedIn', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.ImIntoTitleFlexView}>
          <View style={[styles.TitleFlexView, { marginTop: 0, marginBottom: 0 }]}>
            <Image
              resizeMode="contain"
              tintColor={colors.TextColor}
              source={CommonIcons.interested_in_icon}
              style={styles.TitleIcon}
            />
            <Text style={[styles.NameText, { color: colors.TextColor }]}>Interested in</Text>
          </View>
          <Text style={[styles.NameText, { color: colors.TextColor }]}>{`(${
            profile?.orientation !== undefined && profile?.orientation?.length !== 0 ? profile?.orientation?.length : 0
          }/3)`}</Text>
        </View>
        <View>
          <FlatList data={GendersData} renderItem={renderInterested} keyExtractor={(item, index) => index.toString()} />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('ZodiacSign', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.zodiac_sign_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Zodiac Sign</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={StarSignData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <RenderSingleSelectionView item={item} value={'star_sign' as keyof MagicalPersonType} />;
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('CommunicationStyle', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.communication_style_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Communication Style</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={CommunicationStyleData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <RenderSingleSelectionView item={item} value="communication_stry" />;
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('Exercise', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.exercise_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Exercise</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={ExerciseFrequencyData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <RenderSingleSelectionView item={item} value={'exercise'} />;
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('SmokeAndDrink', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.smoke_and_drinks_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Smoke & Drink</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={SmokingDrinkingFrequencyData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <RenderSingleSelectionView item={item} value={'smoke'} />;
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('Movie', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.movies_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Movie</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={MovieWatchingFrequencyData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <RenderSingleSelectionView item={item} value={'movies'} />;
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>

      <View
        style={styles.TextViewForSpace}
        onLayout={(event) => {
          StoreViewPosition('Drink', event.nativeEvent.layout.y);
        }}
      >
        <View style={styles.TitleFlexView}>
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.drink_icon}
            style={styles.TitleIcon}
          />
          <Text style={[styles.NameText, { color: colors.TextColor }]}>Drink</Text>
        </View>
        <View>
          <FlatList
            numColumns={3}
            data={PreferredDrinkData}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <RenderSingleSelectionView item={item} value="drink" />;
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(EditProfileSheetView);

const styles = StyleSheet.create({
  bottomSheetContainerView: {
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginBottom: hp('1.5%'),
  },
  NameText: {
    fontSize: hp('1.8%'),
    fontFamily: FONTS.Bold,
  },
  TitleFlexView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  TitleIcon: {
    width: 16,
    height: 16,
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
    marginTop: hp(1),
  },
  AllInputContainerView: {
    width: '100%',
    marginTop: hp('2%'),
  },
  GenderView: {
    padding: 0,
    height: hp('6.8%'),
    width: wp('85%'),
    borderRadius: SIZES.radius,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  GenderText: {
    fontFamily: FONTS.Medium,
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
    borderWidth: 1,
    overflow: 'hidden',
  },
  selectedOption: {
    borderWidth: 2,
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
    borderWidth: 1,
    marginVertical: hp('0.7%'),
    alignSelf: 'center',

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

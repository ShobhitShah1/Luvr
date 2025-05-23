import React, { memo, useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import CommonIcons from '../../../Common/CommonIcons';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomCheckBox from '../../../Components/CustomCheckBox';
import { GendersData } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';

import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const { width } = Dimensions.get('window');

function ListEmptyComponent() {
  return (
    <View style={styles.EmptyViewStyle}>
      <Text style={styles.EmptyViewText}>We Don't Have Any Genders, Sorry</Text>
    </View>
  );
}

function SexualOrientation() {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();

  const initialSexualOrientation: string[] =
    userData.orientation.length !== 0 ? userData.orientation : [];

  const [isLoading, setIsLoading] = useState(false);
  const [showOnProfile, setShowOnProfile] = useState<boolean>(userData.is_orientation_visible);
  const [selectedGenderIndex, setSelectedGenderIndex] =
    useState<string[]>(initialSexualOrientation);

  const toggleCheckMark = useCallback(() => {
    setShowOnProfile(prev => !prev);
  }, []);

  const onPressGenders = useCallback(
    (item: { id: number; name: string }) => {
      const { name } = item;
      if (selectedGenderIndex.includes(name)) {
        setSelectedGenderIndex(prev => prev.filter(selectedName => selectedName !== name));
      } else if (selectedGenderIndex.length < 3) {
        setSelectedGenderIndex(prev => [...prev, name]);
      }
    },
    [selectedGenderIndex],
  );

  const isGenderSelected = (item: { name: string }) => selectedGenderIndex.includes(item?.name);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <GradientBorderView
      style={[
        styles.GenderButtonView,
        {
          borderWidth: isGenderSelected(item) ? 2 : 0.5,
          backgroundColor: isDark ? 'transparent' : colors.White,
        },
      ]}
      gradientProps={{
        colors: isGenderSelected(item)
          ? isDark
            ? colors.ButtonGradient
            : ['transparent', 'transparent']
          : isDark
          ? colors.UnselectedGradient
          : ['transparent', 'transparent'],
      }}
      key={index}
    >
      <Pressable onPress={() => onPressGenders(item)} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.GenderFlexView}>
          <Text
            style={[
              styles.SelectGenderText,
              {
                fontFamily: isGenderSelected(item) ? FONTS.Bold : FONTS.Medium,
                color: colors.TextColor,
              },
            ]}
          >
            {item.name}
          </Text>
          {isGenderSelected(item) && (
            <Image
              resizeMethod="auto"
              resizeMode="contain"
              tintColor={colors.Primary}
              source={CommonIcons.CheckMark}
              style={{ width: hp('2.5%'), height: hp('2.5%') }}
            />
          )}
        </View>
      </Pressable>
    </GradientBorderView>
  );

  const onSubmitPress = async () => {
    try {
      setIsLoading(true);
      const orientations = selectedGenderIndex.map(gender => gender);

      if (orientations.length === 0) {
        throw new Error('Please select your sexual orientation');
      }

      await Promise.all([
        dispatch(updateField(LocalStorageFields.orientation, orientations)),
        dispatch(updateField(LocalStorageFields.is_orientation_visible, showOnProfile)),
      ]);

      navigation.navigate('LoginStack', {
        screen: 'HopingToFind',
      });
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientView>
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
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>
              What is your sexual orientation?
            </Text>
            <Text style={[styles.SelectUptoText, { color: colors.TextColor }]}>Select upto 3</Text>
          </View>

          <View style={styles.genderButtonViewContainer}>
            <FlatList
              data={GendersData}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={ListEmptyComponent}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>

        <View style={styles.BottomContainer}>
          <View style={styles.BottomView}>
            <View style={styles.CheckBoxView}>
              <CustomCheckBox
                isChecked={showOnProfile}
                onToggle={toggleCheckMark}
                BoxText="Show my orientation on my profile"
              />
            </View>
            <GradientButton
              isLoading={isLoading}
              Title="Continue"
              Navigation={onSubmitPress}
              Disabled={selectedGenderIndex.length === 0 || isLoading}
            />
          </View>
        </View>
      </View>
    </GradientView>
  );
}

export default memo(SexualOrientation);

const styles = StyleSheet.create({
  BorderBottomWidth: {
    borderBottomColor: COLORS.Black,
    borderBottomWidth: hp('0.1%'),
    marginTop: hp('1%'),
    right: hp('1.5%'),
    width: '110%',
  },
  BottomContainer: {
    alignSelf: 'center',
    bottom: hp('2%'),
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    width: '90%',
  },
  BottomView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: hp('1.9%'),
    width: '90%',
  },
  CheckBoxView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  CheckboxText: {
    ...GROUP_FONT.h4,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,
    justifyContent: 'center',
    marginLeft: hp('0.5%'),
  },
  EmptyViewStyle: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  EmptyViewText: {
    ...GROUP_FONT.h2,
    textAlign: 'center',
  },
  GenderButtonView: {
    alignContent: 'center',
    alignSelf: 'center',
    borderRadius: SIZES.radius,
    borderWidth: 2,
    height: hp('6.5%'),
    justifyContent: 'center',
    marginVertical: hp('0.5%'),
    width: width - hp('8%'),
  },
  GenderFlexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: hp('2.8%'),
  },
  RenderDataContainer: {
    flex: 1,
    marginTop: hp('1'),
    paddingHorizontal: hp('1'),
  },
  SelectGenderFlexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: hp('2%'),
  },
  SelectGenderText: {
    ...GROUP_FONT.h3,
  },
  SelectUptoText: {
    ...GROUP_FONT.h4,
    fontFamily: FONTS.SemiBold,
    marginVertical: hp('1%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('3.3%'),
  },
  genderButtonViewContainer: {
    height: '67%',
  },
});

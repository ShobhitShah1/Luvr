import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const { width } = Dimensions.get('window');

const ListEmptyComponent = () => {
  return (
    <View style={styles.EmptyViewStyle}>
      <Text style={styles.EmptyViewText}>We Don't Have Any Genders, Sorry</Text>
    </View>
  );
};

const SexualOrientation = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<{ LoginStack: {} }>>();
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();

  const initialSexualOrientation: string[] = userData.orientation.length !== 0 ? userData.orientation : [];

  const [isLoading, setIsLoading] = useState(false);
  const [showOnProfile, setShowOnProfile] = useState<boolean>(userData.is_orientation_visible);
  const [selectedGenderIndex, setSelectedGenderIndex] = useState<string[]>(initialSexualOrientation);

  const toggleCheckMark = useCallback(() => {
    setShowOnProfile((prev) => !prev);
  }, []);

  const onPressGenders = useCallback(
    (item: { id: number; name: string }) => {
      const { name } = item;
      if (selectedGenderIndex.includes(name)) {
        setSelectedGenderIndex((prev) => prev.filter((selectedName) => selectedName !== name));
      } else if (selectedGenderIndex.length < 3) {
        setSelectedGenderIndex((prev) => [...prev, name]);
      }
    },
    [selectedGenderIndex]
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
            ? colors.Gradient
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
      const orientations = selectedGenderIndex.map((gender) => gender);

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
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>What is your sexual orientation?</Text>
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

        <View style={[styles.BottomContainer]}>
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
              Title={'Continue'}
              Navigation={onSubmitPress}
              Disabled={selectedGenderIndex.length === 0 || isLoading}
            />
          </View>
        </View>
      </View>
    </GradientView>
  );
};

export default memo(SexualOrientation);

const styles = StyleSheet.create({
  SelectUptoText: {
    ...GROUP_FONT.h4,
    marginVertical: hp('1%'),
    fontFamily: FONTS.SemiBold,
  },
  genderButtonViewContainer: {
    height: '67%',
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
    borderWidth: 2,
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

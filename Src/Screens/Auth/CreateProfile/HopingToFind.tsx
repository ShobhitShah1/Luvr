import React, { FC, memo, useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import { LookingFor } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const { width } = Dimensions.get('window');

const HopingToFind: FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();
  const { showToast } = useCustomToast();

  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [SelectedLookingForIndex, setSelectedLookingForIndex] = useState<string>(
    userData.hoping ? userData.hoping : {}
  );

  const onPressLookingFor = useCallback(
    (item: string) => {
      const isSelected = SelectedLookingForIndex === item;

      if (isSelected) {
        setSelectedLookingForIndex(item);
      } else {
        setSelectedLookingForIndex(item);
      }
    },
    [SelectedLookingForIndex]
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const selected = SelectedLookingForIndex === item;

    return (
      <GradientBorderView
        style={[
          styles.LookingForListView,
          { borderWidth: selected ? 2 : 0.5, backgroundColor: isDark ? 'transparent' : colors.White },
        ]}
        gradientProps={{
          colors: selected
            ? isDark
              ? colors.ButtonGradient
              : ['transparent', 'transparent']
            : isDark
              ? colors.UnselectedGradient
              : ['transparent', 'transparent'],
        }}
      >
        <Pressable style={styles.buttonView} onPress={() => onPressLookingFor(item)} key={index}>
          <View style={styles.TextView}>
            <Text
              numberOfLines={2}
              style={[
                styles.LookingForText,
                {
                  color: colors.TextColor,
                  fontFamily: selected ? FONTS.Bold : FONTS.Medium,
                },
              ]}
            >
              {item}
            </Text>
            {selected && (
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
  };

  const onPressNext = () => {
    try {
      setIsLoading(true);

      if (SelectedLookingForIndex) {
        dispatch(updateField(LocalStorageFields.hoping, SelectedLookingForIndex));

        setTimeout(() => {
          navigation.navigate('LoginStack', {
            screen: 'DistancePreference',
          });
        }, 200);
      } else {
        showToast(TextString.error.toUpperCase(), 'Please select your hoping', 'error');
      }
    } catch (error) {
      showToast(TextString.error.toUpperCase(), String(error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientView>
      <View style={CreateProfileStyles.Container}>
        <CreateProfileHeader ProgressCount={3} Skip={false} />

        <View style={styles.DataViewContainer}>
          <View style={CreateProfileStyles.ContentView}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>What’s your hoping {'\n'}to find?</Text>
            <Text style={[styles.CompatibilityText, { color: colors.TextColor }]}>
              Honesty helps you and everyone on find what you're looking for.
            </Text>
          </View>

          <View style={{ height: '70%' }}>
            <FlatList
              data={LookingFor}
              renderItem={renderItem}
              style={{ paddingBottom: hp('10%') }}
              contentContainerStyle={styles.FlatListContainer}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>

        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            isLoading={isLoading}
            Title={'Continue'}
            Disabled={!SelectedLookingForIndex || isLoading}
            Navigation={() => onPressNext()}
          />
        </View>
      </View>
    </GradientView>
  );
};

export default memo(HopingToFind);

const styles = StyleSheet.create({
  CompatibilityText: {
    width: '90%',
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Medium,
  },
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  FlatListContainer: {
    flexGrow: 1,
  },
  SelectedLookingForListView: {
    width: '31%',
    left: hp('0.5%'),
    alignContent: 'center',
    marginHorizontal: hp('0.4%'),
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp('15%'),
    borderRadius: hp('1%'),
    marginVertical: hp('0.5%'),
    overflow: 'hidden',
    borderWidth: hp('0.2%'),
    borderColor: COLORS.Primary,
  },
  LookingForListView: {
    height: hp('6.5%'),
    width: width - hp('8%'),
    marginVertical: hp('0.5%'),
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignContent: 'center',
  },
  GenderFlexView: {
    flexDirection: 'row',
    marginHorizontal: hp('2.8%'),
    justifyContent: 'space-between',
  },
  TextView: {
    flexDirection: 'row',
    marginHorizontal: hp('2.8%'),
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '85%',
  },
  EmojiText: {
    ...GROUP_FONT.h1,
    textAlign: 'center',
    marginVertical: hp('0.5%'),
  },
  LookingForText: {
    ...GROUP_FONT.h3,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

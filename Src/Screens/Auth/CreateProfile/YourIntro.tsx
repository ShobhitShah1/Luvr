/* eslint-disable react/no-unstable-nested-components */
import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import { YourIntoData } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { updateField } from '../../../Redux/Action/actions';
import UserService from '../../../Services/AuthService';
import { transformUserDataForApi } from '../../../Services/dataTransformService';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';

import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

function YourIntro() {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();
  const userData = useSelector((state: any) => state?.user);

  const dispatch = useDispatch();
  const { showToast } = useCustomToast();
  const [IsAPILoading, setIsAPILoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(userData.likes_into || []);

  const handleOptionPress = useCallback((YourIntoID: number, name: string) => {
    setSelectedItems(prevSelection => {
      if (prevSelection?.includes(name)) {
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
      ({ item }: { item: { id: number; name: string } }) => {
        const selected = selectedItems && selectedItems?.includes(item.name);

        return (
          <GradientBorderView
            gradientProps={{
              colors: selected
                ? isDark
                  ? colors.ButtonGradient
                  : ['transparent', 'transparent']
                : isDark
                ? colors.UnselectedGradient
                : ['transparent', 'transparent'],
            }}
            style={[
              styles.YourIntoButton,
              {
                borderWidth: selected ? 2 : 0.5,
                backgroundColor: isDark ? 'transparent' : selected ? colors.Primary : colors.White,
              },
            ]}
          >
            <Pressable
              style={{ flex: 1, justifyContent: 'center' }}
              onPress={() => handleOptionPress(item.id, item.name)}
            >
              <Text
                numberOfLines={2}
                style={[
                  styles.CategoriesText,
                  { color: selected ? colors.White : colors.TextColor },
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          </GradientBorderView>
        );
      },
    [selectedItems, handleOptionPress],
  );

  const onPressNext = async () => {
    setIsAPILoading(true);

    try {
      if (selectedItems.length === 5) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.likes_into, selectedItems)),
          dispatch(updateField(LocalStorageFields.eventName, 'app_user_register')),
        ]);

        CallUpdateProfileAPI(selectedItems);
      } else {
        throw new Error(
          `You have selected ${selectedItems.length} items. ${
            5 - selectedItems.length
          } items remaining to reach the total of ${5}.`,
        );
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsAPILoading(false);
    }
  };

  const CallUpdateProfileAPI = async (items: string[]) => {
    try {
      const userDataForApi = transformUserDataForApi(userData);

      const ModifyData = {
        ...userDataForApi,
        likes_into: items,
        validation: false,
        eventName:
          userDataForApi?.login_type === 'social'
            ? 'app_user_register_social'
            : 'app_user_register',
        ...(userDataForApi?.apple_id ? { apple_id: userDataForApi.apple_id } : {}),
      };

      const APIResponse = await UserService.UserRegister(ModifyData);

      if (APIResponse && APIResponse.code === 200) {
        showToast(
          'Registration Successful',
          'Thank you for registering! You can now proceed.',
          'success',
        );

        dispatch(updateField(LocalStorageFields.Token, APIResponse.data?.token));
        navigation.replace('LoginStack', {
          screen: 'AddRecentPics',
        });
      } else {
        const errorMessage =
          APIResponse && APIResponse.error
            ? APIResponse.error
            : 'Unknown error occurred during registration.';

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    }
  };

  return (
    <GradientView>
      <View style={CreateProfileStyles.Container}>
        <CreateProfileHeader ProgressCount={8} Skip={true} handleSkipPress={() => onPressNext()} />
        <View style={styles.DataViewContainer}>
          <View style={styles.ContentView}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>What are you into?</Text>
            <Text style={[styles.YourIntoMatchText, { color: colors.TextColor }]}>
              You like what you like. Now, let everyone know.
            </Text>
          </View>

          <View style={styles.FlatListContainer}>
            <FlatList
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              data={YourIntoData}
              renderItem={renderItem}
              initialNumToRender={50}
              nestedScrollEnabled={false}
              style={styles.FlatListStyle}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.ContainerContainerStyle}
            />
          </View>
        </View>
        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            isLoading={IsAPILoading}
            Title={`Next ${selectedItems?.length || 0}/5`}
            Disabled={false}
            Navigation={() => {
              setIsAPILoading(true);
              setTimeout(() => onPressNext(), 0);
            }}
          />
        </View>
      </View>
    </GradientView>
  );
}

export default memo(YourIntro);

const styles = StyleSheet.create({
  BottomButtonWidth: {
    borderTopColor: COLORS.Placeholder,
    borderTopWidth: hp('0.07%'),
    bottom: hp('1.5%'),
    paddingTop: hp('1.5%'),
    position: 'absolute',
    width: '100%',
  },
  ButtonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '90%',
  },
  CategoriesText: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '85%',
    ...GROUP_FONT.body4,
    color: 'rgba(130, 130, 130, 1)',
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.5%'),
    textAlign: 'center',
  },
  ContainerContainerStyle: {
    width: '100%',
  },
  ContentView: {
    overflow: 'hidden',
    width: '100%',
  },
  DataViewContainer: {
    alignSelf: 'center',
    height: '90%',
    marginTop: hp('1%'),
    width: '84%',
  },
  FlatListContainer: {
    height: '72%',
    marginTop: hp('1.5%'),
  },
  FlatListStyle: {},
  SelectedCategoriesText: {
    color: COLORS.White,
  },
  TitleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('3.3%'),
  },
  YourIntoButton: {
    borderRadius: SIZES.radius,
    height: hp('6.8%'),
    justifyContent: 'center',
    marginVertical: hp('1%'),
    width: hp('12%'),
  },
  YourIntoMatchText: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.Regular,
    marginTop: hp('1%'),
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
    borderColor: COLORS.White,
    borderWidth: 2,
  },
});

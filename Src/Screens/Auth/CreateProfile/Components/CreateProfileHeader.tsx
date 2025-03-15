import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, memo } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface CreateProfileProps {
  ProgressCount: number;
  Skip: boolean;
  handleSkipPress?: () => void;
  hideBack?: boolean;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({ ProgressCount, Skip, handleSkipPress, hideBack }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<{ LoginStack: {} }>>();

  return (
    <View style={styles.headerContainer}>
      <SafeAreaView />
      <View style={styles.buttonAndTitleContainer}>
        <Pressable style={styles.backButtonView} onPress={() => navigation.goBack()}>
          {!hideBack && (
            <Image
              resizeMode="contain"
              tintColor={colors.TextColor}
              source={CommonIcons.TinderBack}
              style={styles.cancelButton}
            />
          )}
        </Pressable>

        <View style={[styles.pageCountView]}>
          {ProgressCount !== 0 && (
            <Text style={[styles.pageCount, { color: colors.TextColor }]}>{ProgressCount}/9</Text>
          )}
        </View>

        <View style={styles.skipButton}>
          {Skip && (
            <Pressable onPress={handleSkipPress}>
              <Text style={[styles.skipText, { color: colors.TextColor }]}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(CreateProfileHeader);

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    margin: hp('1%'),
    paddingHorizontal: hp('1.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonAndTitleContainer: {
    width: '100%',
    marginHorizontal: hp('1.5%'),
    marginVertical: Platform.OS === 'ios' ? 0 : hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    width: hp('3.5%'),
    height: hp('3.5%'),
  },
  pageCountView: {
    width: '33.33%',
    justifyContent: 'center',
    right: hp('1%'),
  },
  pageCount: {
    ...GROUP_FONT.h3,
    fontSize: hp('1.9%'),
    textAlign: 'center',
  },
  skipText: {
    ...GROUP_FONT.h3,
    color: COLORS.Gray,
    textAlign: 'right',
    marginRight: hp('4%'),
  },
  backButtonView: {
    width: '33.33%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp('3.5%'),
  },
  skipButton: {
    width: '33.33%',
    justifyContent: 'center',
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, memo, useEffect } from 'react';
import { Image, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../Common/CommonIcons';
import { FONTS, GROUP_FONT, SIZES } from '../../Common/Theme';
import { useTheme } from '../../Contexts/ThemeContext';
import createThemedStyles from '../../Hooks/createThemedStyles';
import { useThemedStyles } from '../../Hooks/useThemedStyles';
import { fetchCountryCode } from '../../Services/AuthService';
import CustomTextInput from '../CustomTextInput';
import { CountryWithCode } from '../Data';

interface CountryPickerProps {
  ref: any;
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  diallingCode: string | null;
  defaultDiallingCode: string | null;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDiallingCode: React.Dispatch<React.SetStateAction<string | null>>;
  setDefaultDiallingCode: React.Dispatch<React.SetStateAction<string | null>>;
}

const CountryPickerView = forwardRef<TextInput, CountryPickerProps>(
  ({ value, setValue, diallingCode, visible, setVisible, setDiallingCode, setDefaultDiallingCode }, ref) => {
    const { colors } = useTheme();
    const style = useThemedStyles(styles);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const countryCode = await fetchCountryCode();
          const country = CountryWithCode.find((c) => c.code === countryCode);
          if (country && !diallingCode) {
            setDiallingCode(country.dialling_code);
            setDefaultDiallingCode(country.dialling_code);
          }
        } catch (error) {
          setDiallingCode('+91');
          setDefaultDiallingCode('+91');
        } finally {
        }
      };

      fetchData();
    }, []);

    const onRequestOpenCodeModal = () => {
      setVisible(!visible);
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }
    };

    const onCancelNumberPress = () => {
      setValue('');
    };

    return (
      <View style={style.Container}>
        <View style={style.CountyCodeAndNameContainer}>
          <Pressable
            hitSlop={{ top: 10, bottom: 10 }}
            onPress={onRequestOpenCodeModal}
            style={style.CountryCodeAndIconView}
          >
            <Text style={[style.CountryNameText, { color: colors.TextColor }]}>{diallingCode || '+00'}</Text>
            <Image
              resizeMethod="auto"
              resizeMode="contain"
              source={CommonIcons.Down}
              tintColor={colors.TextColor}
              style={style.downIcon}
            />
          </Pressable>

          <View style={style.SapLine} />

          <View style={style.PhoneNumberTextInput}>
            <View style={style.TextInputView}>
              <CustomTextInput
                ref={ref}
                value={value}
                onChangeText={(number) => {
                  const numericText = number.replace(/[^0-9]/g, '');
                  setValue(numericText);
                }}
                autoFocus={false}
                keyboardType="number-pad"
                style={style.TextInput}
                placeholder={'Enter phone number'}
              />
            </View>

            <Pressable onPress={onCancelNumberPress} style={style.CancelIconView}>
              <Image source={CommonIcons.CancelPhoneNumber} tintColor={colors.White} style={style.CancelIcon} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
);

export default memo(CountryPickerView);

const styles = createThemedStyles((colors) => ({
  Container: {
    width: '100%',
    flex: 1,
  },
  CountyCodeAndNameContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  CountryCodeAndIconView: {
    maxWidth: '25%',
    overflow: 'hidden',
    zIndex: 99999999,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryNameView: {
    marginRight: hp('0.5%'),
  },
  loaderView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: hp('2.7%'),
  },
  downImage: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: hp('0.5%'),
  },
  downIcon: {
    width: hp('1.7%'),
    height: hp('1.7%'),
    marginRight: hp('0.5%'),
  },
  CountryNameText: {
    width: '60%',
    ...GROUP_FONT.h3,
  },
  SapLine: {
    height: '100%',
    alignSelf: 'center',
    marginLeft: hp('0.8%'),
    marginRight: hp('0.8%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    borderLeftWidth: hp('0.3%'),
    borderColor: 'rgba(217, 217, 217, 1)',
  },
  PhoneNumberTextInput: {
    width: '75%',
    flexDirection: 'row',
  },
  TextInputView: {
    width: '86%',
    marginLeft: hp('0.5%'),
    justifyContent: 'center',
  },
  TextInput: {
    padding: 0,
    margin: 0,
    ...GROUP_FONT.h3,
    color: colors.White,
    fontFamily: FONTS.SemiBold,
  },
  CancelIconView: {
    width: '10%',
    justifyContent: 'center',
  },
  CancelIcon: {
    width: hp('2.8%'),
    height: hp('2.8%'),
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
}));

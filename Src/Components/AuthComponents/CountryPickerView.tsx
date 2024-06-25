/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {FC, memo, useEffect} from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../Common/Theme';
import {fetchCountryCode} from '../../Services/AuthService';
import CustomTextInput from '../CustomTextInput';
import {CountryWithCode} from '../Data';

interface CountryPickerProps {
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  diallingCode: string | null;
  defaultDiallingCode: string | null;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDiallingCode: React.Dispatch<React.SetStateAction<string | null>>;
  setDefaultDiallingCode: React.Dispatch<React.SetStateAction<string | null>>;
}
const CountryPickerView: FC<CountryPickerProps> = ({
  value,
  setValue,
  diallingCode,
  visible,
  setVisible,
  setIsLoading,
  setDiallingCode,
  setDefaultDiallingCode,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const countryCode = await fetchCountryCode();
        console.log('countryCode', countryCode);
        const country = CountryWithCode.find(c => c.code === countryCode);
        if (country && !diallingCode) {
          setDiallingCode(country.dialling_code);
          setDefaultDiallingCode(country.dialling_code);
        }
      } catch (error) {
        console.error('Error in component:', error);
        setDiallingCode('+91');
        setDefaultDiallingCode('+91');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const OnRequestOpenCodeModal = () => {
    setVisible(!visible);
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  };

  const OnCancelNumberPress = () => {
    setValue('');
  };

  return (
    <View style={styles.Container}>
      <View style={styles.CountyCodeAndNameContainer}>
        <TouchableOpacity
          onPress={OnRequestOpenCodeModal}
          style={styles.CountryCodeAndIconView}>
          <Text style={styles.CountryNameText}>{diallingCode || '+00'}</Text>
          <Image
            resizeMethod="auto"
            resizeMode="contain"
            source={CommonIcons.Down}
            style={styles.downIcon}
          />
        </TouchableOpacity>

        <View style={styles.SapLine} />

        <View style={styles.PhoneNumberTextInput}>
          <View style={styles.TextInputView}>
            <CustomTextInput
              value={value}
              onChangeText={number => {
                const numericText = number.replace(/[^0-9]/g, '');
                setValue(numericText);
              }}
              autoFocus={true}
              keyboardType="number-pad"
              style={styles.TextInput}
              placeholderTextColor={COLORS.Gray}
              placeholder={'Enter phone number'}
            />
          </View>

          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={OnCancelNumberPress}
            style={styles.CancelIconView}>
            <Image
              source={CommonIcons.CancelPhoneNumber}
              style={styles.CancelIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(CountryPickerView);

const styles = StyleSheet.create({
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
    color: COLORS.Black,
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
});

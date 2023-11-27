/* eslint-disable react/react-in-jsx-scope */
import {FC, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getCountry} from 'react-native-localize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../Common/CommonIcons';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../Common/Theme';
import CustomTextInput from '../CustomTextInput';
import CountryWithCode from '../Data/CountryWithCode';

interface CountryData {
  name: string;
  dialling_code: string;
  code: string;
}

interface CountryPickerProps {
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  diallingCode: string | null;
  defaultDiallingCode: string | null;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDiallingCode: React.Dispatch<React.SetStateAction<string | null>>;
  setDefaultDiallingCode: React.Dispatch<React.SetStateAction<string | null>>;
}
const CountryPickerView: FC<CountryPickerProps> = ({
  value,
  setValue,
  diallingCode,
  defaultDiallingCode,
  visible,
  setVisible,
  isLoading,
  setIsLoading,
  setDiallingCode,
  setDefaultDiallingCode,
}) => {
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        setIsLoading(true);
        const deviceCountryCode = getCountry();
        const countriesData: CountryData[] = CountryWithCode;
        const country = countriesData.find(c => c.code === deviceCountryCode);
        if (country) {
          setDiallingCode(country.dialling_code);
          setDefaultDiallingCode(country.dialling_code);
        }
      } catch (error) {
        console.error('Error fetching dialling code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryCode();
  }, []);

  return (
    <View style={styles.Container}>
      {isLoading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator
            color={COLORS.Primary}
            style={styles.loadingIndicator}
          />
        </View>
      ) : (
        <View style={styles.CountyCodeAndNameContainer}>
          <TouchableOpacity
            onPress={() => {
              setVisible(!visible);
            }}
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
                onChangeText={setValue}
                keyboardType="number-pad"
                style={styles.TextInput}
                placeholderTextColor={COLORS.Gray}
                placeholder={'Enter phone number'}
              />
            </View>

            <View style={styles.CancelIconView}>
              <Image
                source={CommonIcons.CancelPhoneNumber}
                style={styles.CancelIcon}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CountryPickerView;

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
    height: '110%',
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
    width: '82%',
    marginLeft: hp('0.5%'),
    justifyContent: 'center',
  },
  TextInput: {
    padding: 0,
    margin: 0,
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold
  },
  CancelIconView: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CancelIcon: {
    width: hp('2.5%'),
    height: hp('2.5%'),
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

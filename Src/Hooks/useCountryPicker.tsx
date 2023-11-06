import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
  getAllCountries,
} from 'react-native-country-picker-modal';
import * as RNLocalize from 'react-native-localize';
import CommonIcons from '../Common/CommonIcons';
import {CommonSize} from '../Common/CommonSize';
import {COLORS, FONTS} from '../Common/Theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const useCountryPicker = () => {
  const [Visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [defaultCountryCode, setDefaultCountryCode] = useState<string | null>(
    null,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    setIsLoading(true);
    const userCountryCode: string = RNLocalize.getCountry();
    if (userCountryCode) {
      setCountryCode(userCountryCode);
      getAllCountries(countryCode)
        .then((countries: Country[]) => {
          const country = countries.find(
            (c: Country) => c.cca2 === userCountryCode,
          );
          console.log('country:', country && country.callingCode);
          if (country && country.callingCode) {
            setDefaultCountryCode(country.callingCode[0]);
            setCountryCode(userCountryCode);
          }
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [isFocused]);

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    setDefaultCountryCode(country.callingCode[0]);
    setVisible(false);
  };

  const CountryPickerComponent = () => (
    <View>
      {isLoading ? (
        <View style={styles.LoaderView}>
          <ActivityIndicator
            color={COLORS.Primary}
            style={styles.LoadingIndicator}
          />
        </View>
      ) : (
        <View style={styles.CountyCodeAndNameContainer}>
          <View style={styles.CountryNameView}>
            <Text
              style={{
                fontSize: hp('2.1%'),
                fontFamily: FONTS.Medium,
                color: COLORS.Black,
              }}>
              {countryCode || 'IN'}
            </Text>
          </View>
          <View>
            <CountryPicker
              visible={Visible}
              theme={{
                fontSize: hp('2.1%'),
                fontFamily: FONTS.Regular,
              }}
              onOpen={() => {
                setVisible(!Visible);
              }}
              onSelect={handleCountrySelect}
              withFlagButton={false}
              withFilter={true}
              withFlag={true}
              withModal={true}
              withCloseButton={true}
              withCurrency={false}
              withCurrencyButton={false}
              withCallingCodeButton={true}
              withCountryNameButton={false}
              withAlphaFilter={true}
              withCallingCode={false}
              withEmoji={true}
              countryCode={(countryCode as CountryCode) || 'IN'}
            />
          </View>
          <View style={styles.DownImage}>
            <Image
              resizeMode="contain"
              source={CommonIcons.Down}
              style={styles.DownIcon}
            />
          </View>
        </View>
      )}
    </View>
  );

  return {
    countryCode,
    defaultCountryCode,
    Visible,
    setVisible,
    CountryPickerComponent,
    setDefaultCountryCode,
  };
};

export default useCountryPicker;

const styles = StyleSheet.create({
  CountyCodeAndNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  CountryNameView: {
    marginRight: hp('0.5%'),
  },
  LoaderView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  LoadingIndicator: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    fontSize: hp('2.7%'),
  },
  DownImage: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: hp('0.5%'),
  },
  DownIcon: {
    width: hp('1.7%'),
    height: hp('1.7%'),
  },
});

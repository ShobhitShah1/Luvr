import { Text, View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import CountryPicker, {
  Country,
  CountryCode,
  getAllCountries,
} from 'react-native-country-picker-modal';
import * as RNLocalize from 'react-native-localize';
import { ActiveOpacity, COLORS, FONTS } from '../Common/Theme';
import { CommonSize } from '../Common/CommonSize';
import CommonIcons from '../Common/CommonIcons';

const useCountryPicker = () => {
  const [Visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [defaultCountryCode, setDefaultCountryCode] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setIsLoading(true);
    const userCountryCode = RNLocalize.getCountry();
    setCountryCode(userCountryCode);

    getAllCountries(userCountryCode).then(data => {
      if (data) {
        const country = data.find(country => country.cca2 === userCountryCode);
        if (country) {
          setDefaultCountryCode(Number(country.callingCode[0]));
        }
      }
      setIsLoading(false);
    });
  }, []);

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    setDefaultCountryCode(Number(country.callingCode[0]));
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
            <Text style={{
              fontSize: CommonSize(15),
              fontFamily: FONTS.Medium,
              color: COLORS.Black
            }}>{countryCode}</Text>
          </View>
          <View> 
            <CountryPicker
              visible={Visible}
              theme={{
                fontSize: CommonSize(15),
                fontFamily: FONTS.Medium,
                // color: COLORS.Black
              }}
              onOpen={() => {
                setVisible(!Visible)
              }}
              onSelect={handleCountrySelect}
              withFlagButton={false}
              withFilter={true}
              withFlag={true}
              withModal={true}
              ActiveOpacity={ActiveOpacity}
              withCloseButton={true}
              withCurrency={false}
              withCurrencyButton={false}
              withCallingCodeButton={true}
              withCountryNameButton={false}
              withAlphaFilter={true}
              withCallingCode={false}
              withEmoji={true}
              countryCode={countryCode as CountryCode}
              //! Bellow Is Wrong Its Passing Number Rather Then String It Should Pass "IN" Not 91 Need To Change
              preferredCountries={
                defaultCountryCode ? [defaultCountryCode] : []
              }
            />
          </View>
          <View style={styles.DownImage}>
            <Image resizeMode='contain' source={CommonIcons.Down} style={styles.DownIcon} />
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
  };
};

export default useCountryPicker;

const styles = StyleSheet.create({
  CountyCodeAndNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  CountryNameView: {
    marginRight: CommonSize(5)
  },
  LoaderView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LoadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Text: {
    fontSize: CommonSize(20)
  },
  DownImage: {
    marginLeft: CommonSize(5),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  DownIcon: {
    width: CommonSize(18),
    height: CommonSize(18)
  }
});

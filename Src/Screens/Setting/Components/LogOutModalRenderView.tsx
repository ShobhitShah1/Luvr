import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {ActiveOpacity, COLORS, FONTS} from '../../../Common/Theme';
import CommonIcons from '../../../Common/CommonIcons';

interface SettingModalProps {
  onPress: () => void;
  title: string;
  description: string;
  ButtonTitle: string;
  ButtonCloseText: string;
}

const LogOutModalRenderView: FC<SettingModalProps> = ({
  onPress,
  title,
  description,
  ButtonTitle,
  ButtonCloseText,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        style={styles.CloseModalContainerView}>
        <Image source={CommonIcons.CloseModal} style={styles.CloseModalImage} />
      </TouchableOpacity>
      <View style={styles.ContentContainer}>
        <View style={styles.TextContainerView}>
          <Text style={styles.TitleText}>{title}</Text>
          <Text style={styles.DescriptionText}>{description}</Text>
        </View>

        <View style={styles.ButtonContainer}>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={ActiveOpacity}
            style={styles.LogoutButtonContainer}>
            <Text style={styles.LogoutButtonText}>{ButtonTitle}</Text>
          </TouchableOpacity>
          <Text style={styles.NoButtonText}>{ButtonCloseText}</Text>
        </View>
      </View>
    </View>
  );
};

export default LogOutModalRenderView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
    width: Dimensions.get('screen').width - 50,
  },
  CloseModalContainerView: {
    position: 'absolute',
    right: 20,
    top: 20,
    justifyContent: 'center',
  },
  CloseModalImage: {
    width: 23,
    height: 23,
  },
  ContentContainer: {
    width: '90%',
    justifyContent: 'center',
    marginVertical: 10,
  },
  TextContainerView: {
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    fontSize: 19,
    textAlign: 'center',
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
  DescriptionText: {
    fontSize: 15,
    marginVertical: 5,
    textAlign: 'center',
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
  },
  ButtonContainer: {
    marginVertical: 10,
  },
  LogoutButtonContainer: {
    width: 220,
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.Primary,
  },
  LogoutButtonText: {
    fontSize: 15,
    color: COLORS.White,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
  NoButtonText: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.Primary,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
});

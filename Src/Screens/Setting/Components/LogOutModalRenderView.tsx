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
import Button from '../../../Components/Button';

interface SettingModalProps {
  onPress: () => void;
  title: string;
  description: string | JSX.Element;
  ButtonTitle: string;
  ButtonCloseText: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogOutModalRenderView: FC<SettingModalProps> = ({
  onPress,
  title,
  description,
  ButtonTitle,
  ButtonCloseText,
  setState,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setState(false)}
        activeOpacity={ActiveOpacity}
        style={styles.CloseModalContainerView}>
        <Image source={CommonIcons.CloseModal} style={styles.CloseModalImage} />
      </TouchableOpacity>
      <View style={styles.ContentContainer}>
        <View style={styles.TextContainerView}>
          <Text style={styles.TitleText}>{title}</Text>
          {typeof description === 'string' ? (
            <Text style={styles.DescriptionText}>{description}</Text>
          ) : (
            description
          )}
        </View>

        <View style={styles.ButtonContainer}>
          <Button
            isLoading={false}
            onPress={onPress}
            ButtonTitle={ButtonTitle}
          />
          {/* <TouchableOpacity
            onPress={onPress}
            activeOpacity={ActiveOpacity}
            style={styles.LogoutButtonContainer}>
            <Text style={styles.LogoutButtonText}>{ButtonTitle}</Text>
          </TouchableOpacity> */}
          <Text onPress={() => setState(false)} style={styles.NoButtonText}>
            {ButtonCloseText}
          </Text>
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
    zIndex: 9999,
    position: 'absolute',
    right: 20,
    top: 20,
    justifyContent: 'center',
  },
  CloseModalImage: {
    width: 26,
    height: 26,
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
    fontSize: 14.5,
    marginVertical: 5,
    textAlign: 'center',
    color: 'rgba(108, 108, 108, 1)',
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

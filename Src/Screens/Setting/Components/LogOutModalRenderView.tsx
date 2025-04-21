import React, { FC, memo } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS } from '../../../Common/Theme';
import Button from '../../../Components/Button';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';

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
  const { colors, isDark } = useTheme();

  return (
    <GradientBorderView
      style={[
        styles.container,
        {
          borderWidth: 2,
          backgroundColor: isDark ? 'rgba(13, 1, 38, 0.5)' : colors.White,
        },
      ]}
    >
      <Pressable
        onPress={() => setState(false)}
        style={styles.CloseModalContainerView}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={CommonIcons.CloseModal} style={styles.CloseModalImage} />
      </Pressable>
      <View style={styles.ContentContainer}>
        <View style={styles.TextContainerView}>
          <Text style={[styles.TitleText, { color: colors.TextColor }]}>{title}</Text>
          {typeof description === 'string' ? (
            <Text
              style={[styles.DescriptionText, { color: isDark ? 'rgba(198, 198, 198, 1)' : 'rgba(108, 108, 108, 1)' }]}
            >
              {description}
            </Text>
          ) : (
            description
          )}
        </View>

        <View style={styles.ButtonContainer}>
          <Button isLoading={false} onPress={onPress} ButtonTitle={ButtonTitle} />
          <Text onPress={() => setState(false)} style={[styles.NoButtonText, { color: colors.TextColor }]}>
            {ButtonCloseText}
          </Text>
        </View>
      </View>
    </GradientBorderView>
  );
};

export default memo(LogOutModalRenderView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('screen').width - 50,
  },
  CloseModalContainerView: {
    zIndex: 9999,
    position: 'absolute',
    right: 15,
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
    fontFamily: FONTS.Bold,
  },
  DescriptionText: {
    fontSize: 14.5,
    marginVertical: 5,
    textAlign: 'center',
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
  },
  LogoutButtonText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
  NoButtonText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
});

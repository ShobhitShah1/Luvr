import type { FC } from 'react';
import React, { memo } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import CommonIcons from '../../../Common/CommonIcons';
import { FONTS } from '../../../Common/Theme';
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
              style={[
                styles.DescriptionText,
                { color: isDark ? 'rgba(198, 198, 198, 1)' : 'rgba(108, 108, 108, 1)' },
              ]}
            >
              {description}
            </Text>
          ) : (
            description
          )}
        </View>

        <View style={styles.ButtonContainer}>
          <Button isLoading={false} onPress={onPress} ButtonTitle={ButtonTitle} />
          <Text
            onPress={() => setState(false)}
            style={[styles.NoButtonText, { color: colors.TextColor }]}
          >
            {ButtonCloseText}
          </Text>
        </View>
      </View>
    </GradientBorderView>
  );
};

export default memo(LogOutModalRenderView);

const styles = StyleSheet.create({
  ButtonContainer: {
    marginVertical: 10,
  },
  CloseModalContainerView: {
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    top: 20,
    zIndex: 9999,
  },
  CloseModalImage: {
    height: 26,
    width: 26,
  },
  ContentContainer: {
    justifyContent: 'center',
    marginVertical: 10,
    width: '90%',
  },
  DescriptionText: {
    fontFamily: FONTS.Medium,
    fontSize: 14.5,
    marginVertical: 5,
    textAlign: 'center',
  },
  LogoutButtonContainer: {
    alignSelf: 'center',
    borderRadius: 20,
    height: 55,
    justifyContent: 'center',
    width: 220,
  },
  LogoutButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    textAlign: 'center',
  },
  NoButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  TextContainerView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: 19,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    width: Dimensions.get('screen').width - 50,
  },
});

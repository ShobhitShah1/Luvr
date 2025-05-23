import { Skeleton } from 'moti/skeleton';
import React, { memo } from 'react';
import type { FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { LayoutChangeEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { FONTS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface EditProfileBoxViewProps {
  children: React.ReactElement;
  onLayout?: (event: LayoutChangeEvent) => void;
  IsViewLoading?: boolean;
  withTextInput?: boolean;
  value?: string | undefined;
  onChangeText?: (value: string) => void;
  TextInputChildren?: React.ReactElement;
  TextInputContainerStyle?: StyleProp<ViewStyle>;
  maxLength?: number;
  TextInputStyle?: StyleProp<TextStyle>;
  PlaceholderText?: string;
}

const EditProfileBoxView: FC<EditProfileBoxViewProps> = ({
  children,
  onLayout,
  IsViewLoading,
  withTextInput,
  value,
  onChangeText,
  TextInputChildren,
  TextInputContainerStyle,
  maxLength,
  TextInputStyle,
  PlaceholderText,
}) => {
  const { colors, isDark } = useTheme();

  return IsViewLoading ? (
    <Skeleton colors={colors.LoaderGradient} show={true}>
      <View style={styles.LoadingView} />
    </Skeleton>
  ) : withTextInput ? (
    <View style={[styles.AboutMeCustomView, TextInputContainerStyle]}>
      <TextInput
        multiline
        value={value}
        editable={true}
        maxLength={maxLength}
        defaultValue={value}
        cursorColor={colors.Primary}
        onChangeText={onChangeText}
        style={[
          styles.AboutMeTextViewStyle,
          { color: isDark ? colors.White : 'rgba(0,0,0,1)' },
          TextInputStyle,
        ]}
        placeholderTextColor={colors.Placeholder}
        placeholder={PlaceholderText}
      />
      {TextInputChildren}
    </View>
  ) : (
    <View onLayout={onLayout} style={styles.container}>
      {children}
    </View>
  );
};

export default memo(EditProfileBoxView);

const styles = StyleSheet.create({
  AboutMeCustomView: {
    borderRadius: 25,
    marginVertical: 5,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 3,
  },
  AboutMeTextViewStyle: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  LoadingView: {
    alignContent: 'center',
    borderRadius: 25,
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  container: {
    alignContent: 'center',
    borderRadius: 25,
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});

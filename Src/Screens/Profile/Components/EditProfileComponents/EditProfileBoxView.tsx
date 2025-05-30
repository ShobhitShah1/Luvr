import { Skeleton } from 'moti/skeleton';
import React, { FC, memo } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
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
  textInputProps?: TextInputProps;
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
  textInputProps,
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
        style={[styles.AboutMeTextViewStyle, { color: isDark ? colors.White : 'rgba(0,0,0,1)' }, TextInputStyle]}
        placeholderTextColor={colors.Placeholder}
        placeholder={PlaceholderText}
        {...textInputProps}
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
  container: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  LoadingView: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  AboutMeCustomView: {
    borderRadius: 25,
    marginVertical: 5,
    paddingVertical: 3,
    paddingHorizontal: 20,
    minHeight: 50,
  },
  AboutMeTextViewStyle: {
    ...GROUP_FONT.body4,
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
});

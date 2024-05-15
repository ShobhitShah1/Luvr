import {Skeleton} from 'moti/skeleton';
import React, {FC, memo} from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS, FONTS, GROUP_FONT} from '../../../../Common/Theme';

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
  return IsViewLoading ? (
    <Skeleton colors={COLORS.LoaderGradient} show={true}>
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
        cursorColor={COLORS.Primary}
        onChangeText={onChangeText}
        style={[styles.AboutMeTextViewStyle, TextInputStyle]}
        placeholderTextColor={COLORS.Placeholder}
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
  container: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  LoadingView: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  AboutMeCustomView: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: COLORS.White,
  },
  AboutMeTextViewStyle: {
    ...GROUP_FONT.body4,
    fontSize: 14,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
    // justifyContent: 'flex-start',
  },
});

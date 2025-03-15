import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../Common/Theme';
import { useTheme } from '../Contexts/ThemeContext';

interface CustomTextInputProps extends TextInputProps {}
const CustomTextInput: React.FC<CustomTextInputProps> = (props, ref) => {
  const { style, ...restProps } = props;
  const { colors } = useTheme();

  const combinedStyles = Array.isArray(style) ? [...style] : [style];

  return (
    <TextInput
      ref={ref}
      style={[{ color: colors.TextColor }, combinedStyles as StyleProp<ViewStyle>]}
      cursorColor={COLORS.Primary}
      selectionColor={COLORS.Secondary}
      placeholderTextColor={colors.White}
      {...restProps}
    />
  );
};

export default forwardRef(CustomTextInput);

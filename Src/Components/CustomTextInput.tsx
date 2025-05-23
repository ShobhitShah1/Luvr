import React, { forwardRef, memo } from 'react';
import { TextInput } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';

import { COLORS } from '../Common/Theme';
import { useTheme } from '../Contexts/ThemeContext';

const CustomTextInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
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
});

export default memo(CustomTextInput);

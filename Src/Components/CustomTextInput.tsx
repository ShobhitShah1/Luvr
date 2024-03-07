import React, {forwardRef} from 'react';
import {TextInput, TextInputProps, StyleProp, ViewStyle} from 'react-native';
import {COLORS} from '../Common/Theme';

interface CustomTextInputProps extends TextInputProps {}
const CustomTextInput: React.FC<CustomTextInputProps> = (props, ref) => {
  const {style, ...restProps} = props;

  const combinedStyles = Array.isArray(style) ? [...style] : [style];

  return (
    <TextInput
      ref={ref}
      style={combinedStyles as StyleProp<ViewStyle>}
      cursorColor={COLORS.Primary}
      selectionColor={COLORS.Secondary}
      {...restProps}
    />
  );
};

export default forwardRef(CustomTextInput);

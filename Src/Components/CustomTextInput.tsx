import React from 'react';
import {TextInput, TextInputProps, StyleProp, ViewStyle} from 'react-native';
import {COLORS} from '../Common/Theme';

interface CustomTextInputProps extends TextInputProps {}
const CustomTextInput: React.FC<CustomTextInputProps> = props => {
  const {style, ...restProps} = props;

  const combinedStyles = Array.isArray(style) ? [...style] : [style];

  return (
    <TextInput
      style={combinedStyles as StyleProp<ViewStyle>}
      cursorColor={COLORS.Primary}
      selectionColor={COLORS.Secondary}
      {...restProps}
    />
  );
};

export default CustomTextInput;

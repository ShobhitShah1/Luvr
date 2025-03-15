import omit from 'lodash/omit';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import GradientBorder, { RequiredGradientBorderProps } from './GradientBorder';

type GradientBorderViewProps = Omit<
  ViewStyle,
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'paddingBottom'
  | 'padding'
  | 'borderColor'
  | 'borderLeftColor'
  | 'borderRightColor'
  | 'borderTopColor'
  | 'borderBottomColor'
>;

export type GradientBorderViewStyle = StyleProp<
  GradientBorderViewProps & {
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    padding?: number;
  }
>;

export const GradientBorderView = ({
  gradientProps,
  ...props
}: Omit<ViewProps, 'style'> & {
  style?: GradientBorderViewStyle;
} & RequiredGradientBorderProps) => {
  const styles = StyleSheet.flatten(props.style);
  const userAllPadding = styles?.padding ? styles?.padding : 0;
  const compensationAllPadding = styles?.borderWidth ? styles?.borderWidth : 0;

  function calcPaddingForSide(
    paddingName: 'paddingLeft' | 'paddingRight' | 'paddingTop' | 'paddingBottom',
    borderWidthName: 'borderTopWidth' | 'borderBottomWidth' | 'borderLeftWidth' | 'borderRightWidth'
  ) {
    const userPadding = typeof styles[paddingName] !== 'undefined' ? styles[paddingName]! : userAllPadding;
    const compensationPadding =
      typeof styles[borderWidthName] !== 'undefined' ? styles[borderWidthName]! : compensationAllPadding;
    return compensationPadding + userPadding;
  }

  if (
    __DEV__ &&
    !(
      styles.borderWidth ||
      styles.borderTopWidth ||
      styles.borderLeftWidth ||
      styles.borderRightWidth ||
      styles.borderBottomWidth
    )
  ) {
    console.warn('No borderWidth was passed in the GradientBorderView style, no border will be shown.');
  }

  return (
    <View
      {...props}
      pointerEvents="auto"
      style={[
        {
          paddingLeft: calcPaddingForSide('paddingLeft', 'borderLeftWidth'),
          paddingRight: calcPaddingForSide('paddingRight', 'borderRightWidth'),
          paddingBottom: calcPaddingForSide('paddingBottom', 'borderBottomWidth'),
          paddingTop: calcPaddingForSide('paddingTop', 'borderTopWidth'),
        },
        omit(styles, ['borderWidth', 'borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderBottomWidth']),
      ]}
    >
      <GradientBorder
        gradientProps={gradientProps}
        borderRadius={typeof styles.borderRadius === 'number' ? styles.borderRadius : undefined}
        borderWidth={styles.borderWidth}
        borderBottomWidth={styles.borderBottomWidth}
        borderRightWidth={styles.borderRightWidth}
        borderLeftWidth={styles.borderLeftWidth}
        borderTopWidth={styles.borderTopWidth}
        borderTopLeftRadius={typeof styles.borderTopLeftRadius === 'number' ? styles.borderTopLeftRadius : undefined}
        borderTopRightRadius={typeof styles.borderTopRightRadius === 'number' ? styles.borderTopRightRadius : undefined}
        borderBottomRightRadius={
          typeof styles.borderBottomRightRadius === 'number' ? styles.borderBottomRightRadius : undefined
        }
        borderBottomLeftRadius={
          typeof styles.borderBottomLeftRadius === 'number' ? styles.borderBottomLeftRadius : undefined
        }
      />
      {props.children}
    </View>
  );
};

import React, {FC} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {COLORS} from '../../../../Common/Theme';

interface EditProfileBoxViewProps {
  children: React.ReactElement;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const EditProfileBoxView: FC<EditProfileBoxViewProps> = ({
  children,
  onLayout,
}) => {
  return (
    <View onLayout={onLayout} style={styles.container}>
      {children}
    </View>
  );
};

export default EditProfileBoxView;

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
});

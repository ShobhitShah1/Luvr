import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../../../Common/Theme';

interface EditProfileBoxViewProps {
  children: React.ReactElement;
}

const EditProfileBoxView: FC<EditProfileBoxViewProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default EditProfileBoxView;

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    marginVertical: 5,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.White,
  },
});

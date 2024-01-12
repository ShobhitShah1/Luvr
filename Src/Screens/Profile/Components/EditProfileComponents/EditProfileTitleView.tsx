import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {COLORS, GROUP_FONT} from '../../../../Common/Theme';

interface EditProfileProps {
  Icon: any;
  Title: string;
}

const EditProfileTitleView: FC<EditProfileProps> = ({Icon, Title}) => {
  return (
    <View style={styles.TitleViewContainer}>
      <Image
        resizeMode="contain"
        source={Icon}
        tintColor={COLORS.Black}
        style={styles.IconView}
      />
      <Text style={styles.TitleText}>{Title}</Text>
    </View>
  );
};

export default EditProfileTitleView;

const styles = StyleSheet.create({
  TitleViewContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  IconView: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  TitleText: {
    marginLeft: 5,
    ...GROUP_FONT.h3,
    color: COLORS.Black,
  },
});

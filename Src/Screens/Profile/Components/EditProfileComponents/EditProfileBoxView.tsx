import {Skeleton} from 'moti/skeleton';
import React, {FC} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {COLORS} from '../../../../Common/Theme';

interface EditProfileBoxViewProps {
  children: React.ReactElement;
  onLayout?: (event: LayoutChangeEvent) => void;
  IsViewLoading?: boolean;
}

const EditProfileBoxView: FC<EditProfileBoxViewProps> = ({
  children,
  onLayout,
  IsViewLoading,
}) => {
  return IsViewLoading ? (
    <Skeleton colors={COLORS.LoaderGradient} show={true}>
      <View style={styles.LoadingView} />
    </Skeleton>
  ) : (
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
  LoadingView: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
});

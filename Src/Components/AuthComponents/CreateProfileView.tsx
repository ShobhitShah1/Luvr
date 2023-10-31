import React, {FC} from 'react';
import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import * as Progress from 'react-native-progress';
import {COLORS, FONTS} from '../../Common/Theme';
import {CommonSize} from '../../Common/CommonSize';
import CommonIcons from '../../Common/CommonIcons';

interface CreateProfileProps {
  Count: number;
  Title: String;
  Type: String;
}

const CreateProfileView: FC<CreateProfileProps> = ({Count, Title, Type}) => {
  const {width, height} = useWindowDimensions();

  let typeElement;

  switch (Type) {
    case 'Name':
      typeElement = <Text>Render the Name component here</Text>;
      break;
    case 'BOB':
      typeElement = <Text>Render the BOB component here</Text>;
      break;
    case 'Gender':
      typeElement = <Text>Render the Gender component here</Text>;
      break;
    default:
      typeElement = null;
      break;
  }

  return (
    <View>
      <Progress.Bar
        color={COLORS.Primary}
        width={width}
        progress={Count}
        animated={true}
        animationType="timing"
        animationConfig={{bounciness: 10}}
        borderRadius={0}
        borderColor="transparent"
        unfilledColor="rgba(217, 217, 217, 1)"
      />

      <View style={styles.CancelButtonAndTitleText}>
        <Image source={CommonIcons.Cancel} style={styles.CancelButton} />

        <View style={styles.TitleContainer}>
          <Text style={styles.TitleText}>{Title}</Text>
        </View>

        {/* Turn This On To Manage Everything Here */}
        {/* {typeElement} */}
      </View>
    </View>
  );
};

export default CreateProfileView;

const styles = StyleSheet.create({
  CancelButtonAndTitleText: {
    margin: CommonSize(20),
  },
  CancelButton: {
    width: CommonSize(20),
    height: CommonSize(20),
  },
  TitleContainer: {
    marginTop: CommonSize(20),
  },
  TitleText: {
    fontSize: CommonSize(20),
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
});

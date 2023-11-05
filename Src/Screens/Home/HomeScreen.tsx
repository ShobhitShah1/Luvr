/* eslint-disable react-native/no-inline-styles */
import React, { FC, useRef, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';

const HomeScreen: FC = () => {
  const generateDummyData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const dummyPerson = {
        id: i + 1,
        name: `Person ${i + 1}`,
        age: Math.floor(Math.random() * 50) + 18,
        images: [
          'https://media.istockphoto.com/id/1446806057/photo/young-happy-woman-student-using-laptop-watching-webinar-writing-at-home.jpg?s=1024x1024&w=is&k=20&c=ICSLSiYaIZ-Cvk9MF3iF2JmrVRmE6br6dYjCEtyjLYs=',
          'https://cdn.pixabay.com/photo/2014/09/20/23/44/website-454460_1280.jpg',
          'https://cdn.pixabay.com/photo/2020/09/19/19/37/landscape-5585247_1280.jpg',
          'https://cdn.pixabay.com/photo/2015/09/30/01/48/turkey-964831_1280.jpg',
        ],
      };
      data.push(dummyPerson);
    }
    return data;
  };

  const dummyData = generateDummyData();

  const swiper = useRef(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [CardIndex, setCardIndex] = useState<number>(0);

  const [clickPosition, setClickPosition] = useState('');

  const handleCardPress = (event: any, images: any) => {
    const cardWidth = 200; // Set your card width here
    const touchX = event.nativeEvent.locationX; // X coordinate of the touch event

    // Calculate the click position based on touchX and card width
    const position = touchX / cardWidth;

    let newSelectedImageIndex = selectedImageIndex;

    if (position < 0.3 && selectedImageIndex > 0) {
      setClickPosition('Left');
      newSelectedImageIndex = selectedImageIndex - 1;
    } else if (position > 0.7 && selectedImageIndex < images.length - 1) {
      setClickPosition('Right');
      newSelectedImageIndex = selectedImageIndex + 1;
    }

    setSelectedImageIndex(newSelectedImageIndex);

    console.log('selectedImages', newSelectedImageIndex);
  };

  const renderCard = (card: any, index: number) => {
    const imageIndex =
      index === 0 && CardIndex === 0 && selectedImageIndex >= 0
        ? selectedImageIndex
        : 0;

    return (
      <ImageBackground
        source={{uri: card.images[imageIndex]}}
        style={styles.card}>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center'}}
          activeOpacity={1}
          onPress={event => handleCardPress(event, card.images)}>
          <Text style={styles.text}>{index}</Text>
          <Text style={styles.text}>{clickPosition}</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  const onSwiped = (type: any, index: number) => {
    console.log(`on swiped ${type}`);
    console.log(`on swiped Index ${index}`);
    setCardIndex(0);
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiper}
        onSwiped={index => onSwiped('general', index)}
        onSwipedLeft={index => onSwiped('left', index)}
        onSwipedRight={index => onSwiped('right', index)}
        onSwipedTop={index => onSwiped('top', index)}
        onSwipedBottom={index => onSwiped('bottom', index)}
        onTapCard={() => {}}
        cards={dummyData}
        cardIndex={CardIndex}
        cardVerticalMargin={80}
        renderCard={renderCard}
        stackSize={3}
        stackSeparation={15}
        disableBottomSwipe
        swipeBackCard
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    // borderColor: '#E8E8E8',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    color: 'white',
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent',
  },
});

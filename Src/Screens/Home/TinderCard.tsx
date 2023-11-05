import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const TinderCard = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const position = new Animated.ValueXY();

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

  useEffect(() => {
    position.setValue({x: 0, y: 0});
  }, [currentIndex]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({x: gesture.dx, y: gesture.dy});
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = direction => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = direction => {
    // Handle the swiped card (e.g., save to a liked or disliked list)
    // You can also fetch the next card to be displayed
    // Remove the card from your data source
    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {x: 0, y: 0},
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-60deg', '0deg', '60deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{rotate}],
    };
  };

  const renderCard = (item, index) => {
    console.log(item);
    if (index < currentIndex) {
      return null;
    }

    if (index === currentIndex) {
      return (
        <Animated.View
          style={[getCardStyle(), styles.cardStyle]}
          {...panResponder.panHandlers}>
          <Text style={{color: 'red'}}>{item.name}</Text>
        </Animated.View>
      );
    }

    return (
      <View style={styles.cardStyle}>
        <Text style={{color: 'red'}}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text>Hello</Text>
      <FlatList
        data={dummyData}
        renderItem={({item, index}) => renderCard(item, index)}
        keyExtractor={item => item.id.toString()}
        horizontal
      />
    </View>
  );
};

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
};

export default TinderCard;

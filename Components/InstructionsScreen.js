
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

export default class InstructionsScreen extends Component {
  render() {
    const dotaImage = require('../Resources/Dota2.jpg');
    return (
      <View style={styles.itemStyle}>
        <Image style={styles.imageStyle} source={dotaImage} />
        <Text style={styles.textStyle}>
          Instructions:
          {'\n'}
          {'\n'}
          1. On the Home Screen: You can go to the List Of Heroes to Look and
          Search for Heroes by a keyword.
          {'\n'}
          2. On the Search Screen: You can search for a hero and add them to either team using the buttons.
          {'\n'}
          3. On the Search Screen: In order to remove a hero from an either team, you can either click either of the buttons or click on the image of the hero itself.
          {'\n'}
          4. On the Search Screen: You can also click on each hero to see some details about the hero.
          {'\n'}
          5. On the Details Screen: You can choose to click on the Tweet button which sends a tweet.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightyellow',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
  },
  textStyle: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'left',
    margin: 10,
  },
  imageStyle: {
    width: 300,
    height: 250,
    resizeMode: 'stretch',
  },
});

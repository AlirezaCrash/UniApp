// import the basic React component and library
import { Component } from 'react';
// import react-native specific components
import { Button, Text, View, Image, StyleSheet } from 'react-native';

export default class HomeScreen extends Component {
  render() {
    const dotaImage = require('../Resources/Dota2.jpg');
    const navigation = this.props.navigation;
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.textStyle}>DotA 2</Text>
        <Button
          style={styles.buttonStyle}
          title="List Of Heroes >>"
          onPress={() => navigation.navigate('HeroListScreen')}
        />
        <Image style={styles.imageStyle} source={dotaImage} />
        <Button
          style={styles.buttonStyle}
          title="Instructions >>"
          onPress={() => navigation.navigate('InstructionsScreen')}
        />
        <Text style={styles.textStyle}>
          Created by: Alireza Modiriyan (2024)
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    color: 255,
  },
  buttonStyle: {
    width: 50,
    height: 50,
    backgroundColor: 'powderblue',
  },
  imageStyle: {
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
});

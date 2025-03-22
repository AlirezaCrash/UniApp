import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Button, Text, TouchableOpacity, Image } from 'react-native';
import HTML from 'react-native-render-html';

export default class HeroDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HeroDetails: {},
    };
  }

  componentDidMount() {
    this.setState({ HeroDetails: this.props.route.params.passedHero });
  }

  render() {
    const HeroDetails = this.state.HeroDetails;
    const navigation = this.props.navigation;
    const displayName = HeroDetails ? HeroDetails.displayName : '';
    const bio = HeroDetails && HeroDetails.language ? HeroDetails.language.bio : '';
    const shortName = HeroDetails ? HeroDetails.shortName : '';
    const imageURL = `https://courier.spectral.gg/images/dota/portraits_vert/${shortName}.png`;
    
    return (
      <View style={styles.itemStyle}>
        <ScrollView>
          <Image
            style={styles.imageStyle}
            source={{
              uri: imageURL,
            }}
          />
          <Text style={styles.textStyle}>Name:{displayName}</Text>
          <HTML source={{ html: bio }} />
          <Button
            title="Tweet"
            onPress={() =>
              navigation.navigate('SocialMediaScreen', {
                passedHero: HeroDetails,
                mediaType: 'Twitter',
              })
            }
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
  },
  textStyle: {
    fontSize: 20,
    textAlign: 'justify',
    margin: 10,
  },
  imageStyle: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
    alignItems: 'center'
  },
});

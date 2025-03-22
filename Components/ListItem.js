
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

export default class ListItem extends Component {
  render() {
    // "Hero" is passed character , "winningCount" is the stats for the character 
    const { Hero, winningCount, onButtonPress1, onButtonPress2, isHeroInTeamA, isHeroInTeamB } =
      this.props;
      // change hero background color depending on whether they are chosen or not
    const containerStyle = isHeroInTeamA || isHeroInTeamB ? styles.teamHero : styles.defaultHero;

    if (!winningCount || !winningCount.data || !winningCount.data.heroStats) {
      return null; 
    }
    // dummy hero 
    if (Hero.id === 127) {
      return null;
    }
    const imageURL = `https://courier.spectral.gg/images/dota/icons/${Hero.shortName}.png`;
    const heroData = winningCount.data.heroStats.winMonth.find(
      (hero) => hero.heroId === Hero.id
    );
    const winrate = heroData
      ? ((heroData.winCount / heroData.matchCount) * 100).toFixed(1)
      : 'N/A';
    const matchCount = heroData ? heroData.matchCount : 'N/A';

    return (
      <View style={[styles.row, containerStyle]}>
        <View style={styles.cell}>
          <Image style={styles.imageStyle} source={{ uri: imageURL }} />
        </View>
        <View style={styles.cell}>
          <Text style={styles.textStyle}>{Hero.displayName}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.textStyle}>{matchCount}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.textStyle}>{winrate}%</Text>
        </View>
        <TouchableOpacity onPress={() => onButtonPress1(Hero)}>
          <Text style={styles.button}>A</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onButtonPress2(Hero)}>
          <Text style={styles.button}>B</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    paddingLeft: 5,
    alignItems: 'center',
  },
  imageStyle: {
    width: 25,
    height: 25,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  defaultHero: {
    backgroundColor: 'transparent',
  },
  teamHero: {
    backgroundColor: '#FFCCCB',
  },
});


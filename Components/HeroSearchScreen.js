// import the basic React component and library
import React, { Component } from 'react';
// import react-native specific components
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
// import character related data from our json file
import heroData from '../data/Heroes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HeroSearchScreen extends Component {
  // setting up props and state
  constructor(props) {
    super(props);
    this.state = {
      // 'heroList' will hold the data from our json file
      heroList: [],
      // 'searchedMatches' will hold the queried matches 
      searchedMatches: [],
      // 'bookmarks' will hold the array of bookmarks using async storage
      bookmarks: [],
    };
  }

  componentDidMount() {
    this.getHeroList();
    // loading the searched matches passed through the prop 
    this.setState({ searchedMatches: this.props.route.params.passedData });
    this.loadBookmarks();
  }
// function for loading bookmarks from async storage
  async loadBookmarks() {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      if (bookmarks) {
        this.setState({ bookmarks: JSON.parse(bookmarks) });
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }
  // function for loading hero data
  getHeroList() {
    const heroList = Object.values(heroData);
    this.setState({ heroList });
  }
  // this function is used to find the shortName of heroes using their id
  getShortNameById = (id) => {
    const hero = this.state.heroList.find((hero) => hero.id === id);
    return hero ? hero.shortName : null;
  };
  // function that is used for rendering each hero's icon
  renderHeroItem = ({ item }) => {
    const heroShortName = this.getShortNameById(item);
    const imageURL = heroShortName
      ? `https://courier.spectral.gg/images/dota/icons/${heroShortName}.png`
      : null;

    return (
      <View style={styles.heroContainer}>
        {imageURL && (
          <Image
            style={styles.heroImage}
            source={{ uri: imageURL }}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };
 // function that is used for rendering each queried match
renderMatch = ({ item }) => {
  // check if the match is bookmarked
  const isBookmarked = this.state.bookmarks.some(
    (bookmark) => bookmark.match_id === item.match_id
  );

  return (
    <View style={styles.matchContainer}>
      <TouchableOpacity onPress={() => this.onStarPress(item)}>
        <Text style={[styles.star, isBookmarked ? styles.bookmarkedStar : null]}>
          ★
        </Text>
      </TouchableOpacity>
      <View style={styles.matchContent}>
        <Text style={styles.matchId}>Match ID: {item.match_id}</Text>
        <Text>Radiant:</Text>
        <View style={styles.heroContainer}>
          {item.teama.map((heroId) => (
            <View key={heroId}>{this.renderHeroItem({ item: heroId })}</View>
          ))}
        </View>
        <Text>Dire:</Text>
        <View style={styles.heroContainer}>
          {item.teamb.map((heroId) => (
            <View key={heroId}>{this.renderHeroItem({ item: heroId })}</View>
          ))}
        </View>
      </View>
    </View>
  );
};

  // function to add the match to bookmarks
  async onStarPress (item) {
    try {
      const { match_id, teama, teamb } = item;

      const isBookmarked = this.state.bookmarks.some(
        (bookmark) => bookmark.match_id === match_id
      );

      if (!isBookmarked) {
        const newBookmark = { match_id, teama, teamb };
        const updatedBookmarks = [...this.state.bookmarks, newBookmark];

        this.setState({ bookmarks: updatedBookmarks });

        await AsyncStorage.setItem(
          'bookmarks',
          JSON.stringify(updatedBookmarks)
        );
        console.log('Bookmark saved successfully!');
      } else {
        const bookmarks = await AsyncStorage.getItem('bookmarks');
      // check if bookmarks exist
      let bookmarksArray = bookmarks ? JSON.parse(bookmarks) : [];
      // check if the clicked item exists in the bookmarks using the 'match_id' attribute
        const index = bookmarksArray.findIndex(
        (bookmark) => bookmark.match_id === item.match_id
      );
      if (index !== -1) {
        // remove the bookmark and save the updated bookmark list to async storage
        bookmarksArray.splice(index, 1);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
        console.log('Bookmark removed successfully!');
        this.setState({ bookmarks: bookmarksArray });
        //console.log('Bookmark already exists!');
        }
      }
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  }

  render() {
    const matchList = this.state.searchedMatches;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={matchList}
          renderItem={this.renderMatch}
          keyExtractor={(item) => item.match_id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heroContainer: {
    margin: 5,
    width: 35,
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  star: {
    fontSize: 35,
    color: 'grey',
  },
  bookmarkedStar: {
    color: 'gold',
  },
    matchContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  matchContent: {
    marginLeft: 10,
  },
  matchId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

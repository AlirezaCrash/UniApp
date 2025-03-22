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
import AsyncStorage from '@react-native-async-storage/async-storage';
// import character related data from our json file
import heroData from '../data/Heroes.json';
export default class Bookmarks extends Component {
// setting up props and state
  constructor(props) {
    super(props);
    this.state = {
// 'bookmarks' will hold the array of bookmarks using async storage
      bookmarks: [],
// 'heroList' will hold the data from our json file
      heroList: [],
    };
  }

  componentDidMount() {
    // load the previous bookmarks if available
    this.loadBookmarks();
    // load the data for our heroes
    this.getHeroList();
  }
  // function for loading hero data
  getHeroList() {
    // read and store the hero data values into our state variable
    const heroList = Object.values(heroData);
    this.setState({ heroList });
  }
   // function for loading bookmarks from async storage
  async loadBookmarks() {
    try {
      // local variable to save the bookmarks given by async storage
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      
      // save the bookmarks if there are any
      if (bookmarks !== null) {
        this.setState({ bookmarks: JSON.parse(bookmarks) });
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }
  // this function is used to find the shortName of heroes using their id
  getShortNameById = (id) => {
    // find the first hero that matches with the id
    const hero = this.state.heroList.find((hero) => hero.id === id);
    return hero ? hero.shortName : null;
  };
  // function that is used for rendering each hero's icon
  renderHeroItem = ({ item }) => {
    const heroShortName = this.getShortNameById(item);
    {/*in order to use the images from the website below we needed the 'shortName' attribute */}
    const imageURL = heroShortName
      ? `https://courier.spectral.gg/images/dota/icons/${heroShortName}.png`
      : null;

    return (
      <View style={styles.heroContainer}>
        {/*checking if the URL exists and then rendering*/}
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
  // render each bookmark
  // each  'item' includes a 'match_id' variable, 'teama' and teamb' arrays
  renderMatch = ({ item }) => {
    {/*console.log(item);*/}
    return (
      <View
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        
{/*touchable component in order to remove each bookmark*/ }
        <TouchableOpacity onPress={() => this.onStarPress(item)}>
          <Text style={styles.star}>★</Text>
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text>Match ID: {item.match_id}</Text>
          {/*rendering the first team AKA team Radiant*/}
          <Text>Radiant:</Text>
          <View style={styles.heroContainer}>
            {/*render a hero icon for each id in the array*/}
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
  // function to remove the existing bookmarks
  async onStarPress(item) {
    try {
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
        //console.log('Bookmark removed successfully!');
        // reload the bookmarks
        this.loadBookmarks();
      } else {
        //console.log('Bookmark not found!');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  }

  render() {
    this.loadBookmarks();
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.bookmarks}
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
    color: 'gold',
  },
});

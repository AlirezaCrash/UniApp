// import the basic React component and library
import React, { Component } from 'react';
// import react-native specific components
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  LogBox,
} from 'react-native';
// import custom component 'ListItem'
import ListItem from './ListItem';
// import character related data from our json file
import heroData from '../data/Heroes.json';
// import searchbar components source: https://crowdbotics.com/posts/blog/add-search-bar-flatlist-react-native-apps/#:~:text=Adding%20a%20Search%20bar,-To%20create%20a&text=One%20possible%20solution%20is%20to,following%20prop%20to%20the%20list.&text=The%20search%20bar%20component%20is,name%20from%20the%20end%2Duser.
import {
  ApplicationProvider,
  Text,
  Avatar,
  Input,
} from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

export default class HeroListScreen extends React.Component {
  // setting up props and state
  constructor(props) {
    super(props);
    this.state = {
      // 'query' is used for the searchbar input
      query: '',
      // 'data' is used for our heroes data from json file
      data: [],
      // 'teamA' and 'teamB' arrays are used for the selected heroes in order to search for the match
      teamA: [],
      teamB: [],
      // an indicator to see if the stats for our heroes are fetched
      dataFetched: false,
      // 'winningCount' is where the stats fetched from stratz API is saved
      winningCount: [],
      // 'displayedHeroList' is basically the same as data but it's used for filtering when the searchbar is used
      displayedHeroList: Object.values(heroData),
    };
    // my stratz API key
    this.apiKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNzlhMmZjOWUtOTU4MC00ZmVmLThkMmEtZjE5NGE4NGFmZmVlIiwiU3RlYW1JZCI6IjI5MDE5OTUwNCIsIm5iZiI6MTcxMDU0NjA2NiwiZXhwIjoxNzQyMDgyMDY2LCJpYXQiOjE3MTA1NDYwNjYsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.YNhFsxHuKjZr190FvSvCnmaQ4rUITCGiFm7C0Q28mf0';
    // initializing the stats in order to render in page
    this.heroStats();
    // my opendota API key , however this is not being used due to the API not requiring one and it costing money for each 100 calls
    this.opendotaKey = 'ca4198e1-d4b2-4f45-91ca-8409e4af9799';
  }
  // function for checking if the searched hero name exists using their 'displayName' attribute
  contains = (hero, query) => {
    if (hero.displayName) {
      const lowerCaseDisplayName = hero.displayName.toLowerCase();
      return lowerCaseDisplayName.includes(query);
    }
    return false;
  };
  // function handling the searched text
  handleSearch = (text) => {
    // format the searched text to lower case
    const formattedQuery = text.toLowerCase();
    // filter our data using the 'contains' function
    const filteredData = Object.values(heroData).filter((hero) => {
      return this.contains(hero, formattedQuery);
    });
    this.setState({ query: text, displayedHeroList: filteredData });
  };
  // function for searchbar rendering
  renderHeader = () => (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={this.handleSearch}
        status="info"
        placeholder="Search for a hero"
        style={{
          borderRadius: 25,
          borderColor: '#333',
          backgroundColor: '#fff',
        }}
        textStyle={{ color: '#000' }}
      />
    </View>
  );
  // function for fetching data
  heroStats() {
    if (!this.state.dataFetched) {
      this.getHeroStats(this.apiKey)
        .then((data) => {
          this.setState({ winningCount: data, dataFetched: true });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }
  // constructor for searching for matches from opendota API
  constructQueryURL = () => {
    const { teamA, teamB } = this.state;

    const teams = [];
    // the API needs the IDs of the heroes and which team they are on
    // an example is : teamA=69&teamA=26&teamA=39&teamA=10&teamB=137&teamB=59
    // which means team A had heroIds of 69-26-39-10 and team B had 137-59
    for (let i = 0; i < Math.max(teamA.length, teamB.length); i++) {
      if (teamA[i]) {
        teams.push(`teamA=${teamA[i]}`);
      }
      if (teamB[i]) {
        teams.push(`teamB=${teamB[i]}`);
      }
    }
    // needed '&' in between the two teams
    const queryString = teams.join('&');

    const baseURL = 'https://api.opendota.com/api/findMatches';
    const queryURL = `${baseURL}?${queryString}`;

    return queryURL;
  };
  // function to fetch the matches from opendota
  async fetchDataFromOpenDota() {
    // construct the query URL
    const queryURL = this.constructQueryURL();
    try {
      const response = await fetch(queryURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Response from OpenDota API:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data from OpenDota API:', error);
      return null;
    }
  }
  // fetching the hero stats from stratz API (graphQL)
  async getHeroStats(apiKey) {
    const url = 'https://api.stratz.com/graphql';
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const query = `
    query {
      heroStats {
        winMonth {
          heroId
          winCount
          matchCount
        }
      }
    }`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  // adding the clicked hero to team A
  handleButtonPress1 = (hero) => {
    //console.log('Button clicked for hero:', hero);
    const { teamA, teamB } = this.state;
    // removing function = if the hero exists in team A , remove the hero
    if (teamA.includes(hero.id)) {
      //console.log('Hero is already in Team A. Removing from Team A.');
      const updatedTeamA = teamA.filter((id) => id !== hero.id);
      this.setState({ teamA: updatedTeamA });
      return;
    }
    // basically a swapping function in order to change from team B to team A , remove from team B first
    if (teamB.includes(hero.id)) {
      //console.log('Hero is already in Team B. Removing from Team B.');
      const updatedTeamB = teamB.filter((id) => id !== hero.id);
      this.setState({ teamB: updatedTeamB });
      return;
    }
    // check if adding the hero makes team A more than 5 which shouldnt be possible.
    if (teamA.length >= 5) {
      Alert.alert(
        'Team is full',
        'Team cannot be more than 5 heroes.'
      );
      //console.log('Team A already has 5 members.');
      return;
    }
    // adding the hero to team A if none of the above were true
    const updatedTeamA = [...teamA, hero.id];
    this.setState({ teamA: updatedTeamA }, () => {
      //console.log('Updated teamA:', this.state.teamA);
    });
  };
  // same function for team B
  handleButtonPress2 = (hero) => {
   // console.log('Button clicked for hero:', hero);
    const { teamA, teamB } = this.state;

    if (teamB.includes(hero.id)) {
      //console.log('Hero already in Team B. Removing from Team B.');
      const updatedTeamB = teamB.filter((id) => id !== hero.id);
      this.setState({ teamB: updatedTeamB });
      return;
    }

    if (teamA.includes(hero.id)) {
      //console.log('Hero already in Team A. Removing from Team A.');
      const updatedTeamA = teamA.filter((id) => id !== hero.id);
      this.setState({ teamA: updatedTeamA });
      return;
    }

    if (teamB.length >= 5) {
      Alert.alert(
        'Team is full',
        'Team cannot be more than 5 heroes.'
      );
      //console.log('Team B already has 5 members.');
      return;
    }

    const updatedTeamB = [...teamB, hero.id];
    this.setState({ teamB: updatedTeamB }, () => {
      //console.log('Updated teamB:', this.state.teamB);
    });
  };
  // initializing state objects data from our json file
  getHeroList() {
    this.setState({
      heroList: Object.values(heroData),
      data: Object.values(heroData),
    });
  }
  renderTableHeader = () => (
    <View style={styles.row}>
      <Text style={styles.headerText}></Text>
      <Text style={styles.headerText}>Hero Name</Text>
      <Text style={styles.headerText}>Pickrate</Text>
      <Text style={styles.headerText}>Winrate</Text>
      <Text style={styles.headerText}></Text>
    </View>
  );
  componentDidMount() {
    this.getHeroList();
  }
  // this function is used to find the shortName of heroes using their id
  getShortNameById = (id) => {
    // Find the first hero that matches the id
    const hero = this.state.data.find((hero) => hero.id === id);
    return hero ? hero.shortName : null;
};
  // function that is used for rendering each hero's icon
  renderHeroItem = ({ item }) => {
    const heroShortName = this.getShortNameById(item);
    const imageURL = `https://courier.spectral.gg/images/dota/icons/${heroShortName}.png`;
  
    return (
      <TouchableOpacity
        key={item} 
        onPress={() => this.removeHeroItem(item)}
        style={styles.touchableItem}>
        <View style={styles.heroContainer}>
          <Image
            style={styles.heroImage}
            source={{ uri: imageURL }}
            resizeMode="contain"
            onError={(error) => console.error('Image loading error:', error)}
          />
        </View>
      </TouchableOpacity>
    );
  };
  removeHeroItem = (item) => {
    const { teamA, teamB } = this.state;
    if (teamA.includes(item)) {
      //console.log('Hero is in Team A. Removing from Team A.');
      const updatedTeamA = teamA.filter((id) => id !== item);
      this.setState({ teamA: updatedTeamA });
      return;
    }
    if (teamB.includes(item)) {
      //console.log('Hero is in Team B. Removing from Team B.');
      const updatedTeamB = teamB.filter((id) => id !== item);
      this.setState({ teamB: updatedTeamB });
      return;
    }
  };
  // checking if hero is selected by the user to highlight it
  heroSelected = ({ id }) => {
    const { teamA, teamB } = this.state;
    if (teamA.includes(id) || teamB.includes(id)) return true;
    else return false;
  };
  render() {
    const navigation = this.props.navigation;
    const heroList = this.state.displayedHeroList;
    const TeamA = this.state.teamA;
    const TeamB = this.state.teamB;
    const imageURL = `https://courier.spectral.gg/images/dota/icons/${heroList.shortName}.png`;
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <View style={styles.teamsAndbutton}>
          <View style={styles.teamsContainer}>
            {/* Team A side */}
            <View styles={styles.teams}>
              <Text style={styles.teamText}>Team A</Text>
              <FlatList
                data={TeamA}
                renderItem={this.renderHeroItem}
                keyExtractor={(item) => item.id}
                horizontal
                contentContainerStyle={styles.teamsContainer}
                showsHorizontalScrollIndicator={false}
              />

              <View style={{ height: 5 }} />
              {/* Team B side */}

              <Text style={styles.teamText}>Team B</Text>
              <FlatList
                data={TeamB}
                renderItem={this.renderHeroItem}
                keyExtractor={(item) => item.id}
                horizontal
                contentContainerStyle={styles.teamsContainer}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={async () => {
              if (this.state.teamA.length > 0 || this.state.teamB.length > 0) {
                const passedData = await this.fetchDataFromOpenDota();
                navigation.navigate('HeroSearchScreen', { passedData });
              } else {
                // If both teamA and teamB are empty, show an Alert to the user
                Alert.alert(
                  'Choose a Hero',
                  'Please choose at least one hero for either Team A or Team B.'
                );
              }
            }}
            style={[styles.searchButton, { alignSelf: 'center' }]}
          >
            <Text style={styles.buttonText}>Search for matches</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {this.renderHeader()}
          {this.renderTableHeader()}
          <FlatList
            data={heroList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('HeroDetailsScreen', { passedHero: item })
                }>
                <ListItem
                  Hero={item}
                  winningCount={this.state.winningCount}
                  onButtonPress1={this.handleButtonPress1}
                  onButtonPress2={this.handleButtonPress2}
                  heroSelected={this.heroSelected(item.id)}
                  isHeroInTeamA={this.state.teamA.includes(item.id)}
                  isHeroInTeamB={this.state.teamB.includes(item.id)}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </ApplicationProvider>
    );
  }
}
const styles = StyleSheet.create({
  teams: {
    flexDirection: 'row',
  },
  teamText: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#fff',

    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderWidth: 2,
    borderColor: 'lightblue',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 20,
    width: 'auto',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  teamsAndbutton: {
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'lightblue',
    backgroundColor: '#fff'
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '100%',
    backgroundColor: '#fff',
  },
  heroContainer: {
    margin: 5,
    width: 30,
    height: 30,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  touchableItem: {
    width: 50,
    height: 50,
  },
});

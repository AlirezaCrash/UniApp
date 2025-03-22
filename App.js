import React, { Component } from 'react';
import {LogBox} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Components/HomeScreen';
import InstructionsScreen from './Components/InstructionsScreen';
import HeroDetailsScreen from './Components/HeroDetailsScreen';
import HeroListScreen from './Components/HeroListScreen';
import SocialMediaScreen from './Components/SocialMedia';
import HeroSearchScreen from './Components/HeroSearchScreen';
import Bookmarks from './Components/Bookmarks';
import MainWebSite from './Components/Website';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
LogBox.ignoreLogs([
  // Exact message
  'Warning: componentWillReceiveProps has been renamed',

  // Substring or regex match
  /GraphQL error: .*/,
]);

// Ignore all log notifications
LogBox.ignoreAllLogs();
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
      {/* side bar  */}
        <Stack.Navigator initialRouteName="DrawerNavigation">
          <Stack.Screen
            name="DrawerNavigation"
            component={DrawerNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HeroDetailsScreen"
            component={HeroDetailsScreen}
            options={({ route }) => ({
              title: route.params && route.params.passedHero
                ? 'Details of ' + route.params.passedHero.displayName
                : 'Hero Details',
              headerBackTitleVisible: false,
              headerTintColor: 'black',
              headerStyle: { backgroundColor: '#fff' },
              headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
            })}
          />
          <Stack.Screen
            name="HeroSearchScreen"
            component={HeroSearchScreen}
            options={({ route }) => ({
              title: route.params && route.params.passedData
                ? 'Your Searched Matches'
                : 'A problem happened with searching',
              headerBackTitleVisible: false,
              headerTintColor: 'black',
              headerStyle: { backgroundColor: '#fff' },
              headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
            })}
          />
          <Stack.Screen name="SocialMediaScreen" component={SocialMediaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="HeroListScreen"
        component={HeroListScreen}
        options={{ title: 'List of all Heroes' }}
      />
      <Drawer.Screen
        name="InstructionsScreen"
        component={InstructionsScreen}
        options={{ title: 'App Instructions' }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{ title: 'Your Bookmarks' }}
      />
      <Drawer.Screen
        name="MainWebsite"
        component={MainWebSite}
        options={{ title: 'Website' }}
      />
    </Drawer.Navigator>
  );
}

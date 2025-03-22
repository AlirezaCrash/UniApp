import React from 'react';
import { WebView } from 'react-native-webview';

const App = () => {
  return (
    <WebView source={{ uri: 'https://www.dota2protracker.com/' }} />
  );
};

export default App;
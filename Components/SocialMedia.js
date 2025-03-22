import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Image, Alert } from 'react-native';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';

export default class SocialMediaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HeroDetails: {},
      mediaType: '',
    };
  }

  componentDidMount() {
    this.setState({ HeroDetails: this.props.route.params.passedHero });
    this.setState({ mediaType: this.props.route.params.mediaType });
    this.props.navigation.setOptions({
      title: 'Post to ' + this.state.mediaType,
    });
  }

  async postToTwitter(message) {
    // keys
    const consumerKey = 'eGvncdbOhBLwyCxYZtgKIHuFM';
    const consumerSecret = 'yqhO6jVHinRlR9WCPjwBKJBaMdOb3zVn32HIrprohAVav1StsP';
    const accessToken = '1774565882435354624-iycLM96IvKq0IyJhlnFHRBHLS0LOKt';
    const accessTokenSecret = '7KB0FsnP1N37P07i0yFGmz8jjXWyf2kXaw6UPM5LmIgws';
    // authentication method 
    const oauthSignatureMethod = 'HMAC-SHA1';
    // timestamp needed for authentication
    const oauthTimestamp = Math.floor(Date.now() / 1000).toString();
    // nonce needed to generate a unique request
    const oauthNonce = Math.random().toString(36).substring(2);

    const method = 'POST';
    const baseUrl = 'https://api.twitter.com/2/tweets';
    const baseString = `${method}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(`oauth_consumer_key=${consumerKey}&oauth_nonce=${oauthNonce}&oauth_signature_method=${oauthSignatureMethod}&oauth_timestamp=${oauthTimestamp}&oauth_token=${accessToken}`)}`;

    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(accessTokenSecret)}`;

    const signature = hmacSHA1(baseString, signingKey).toString(Base64);

    const headers = {
      'Authorization': `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${oauthNonce}", oauth_signature_method="${oauthSignatureMethod}", oauth_timestamp="${oauthTimestamp}", oauth_token="${accessToken}", oauth_signature="${encodeURIComponent(signature)}"`,
      'Content-Type': 'application/json',
    };

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 'text': message }),
    };

    try {
      const response = await fetch(baseUrl, requestOptions);
      const result = await response.text();
      //console.log(result); 
      if (response.ok) {
        Alert.alert('Tweet Posted', 'Your tweet has been posted successfully.');
      } else {
        console.error('Failed to post tweet:', result);
        Alert.alert('Error', 'Failed to post tweet. Please try again later.');
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
      Alert.alert('Error', 'Failed to post tweet. Please try again later.');
    }
  }

  post() {
    const message = this.state.HeroDetails.displayName + ' is my Favorite Hero!!';
    this.postToTwitter(message);
  }

  render() {
    const HeroDetails = this.state.HeroDetails;
    const imageURL = `https://courier.spectral.gg/images/dota/icons/${HeroDetails.shortName}.png`;
    return (
      <View style={styles.itemStyle}>
        <Image
          style={styles.imageStyle}
          source={{
            uri: imageURL,
          }}
        />
        <Text style={styles.textStyle}>
          Posting {HeroDetails.displayName} is my Favorite Hero!!
        </Text>
        <Button
          title={'Post to ' + this.state.mediaType}
          onPress={() => {
            this.post();
          }}
        />
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
    height: 150,
    resizeMode: 'stretch',
  },
});

// @flow
import React, { Component } from 'react';
import * as firebase from 'firebase';
import GoogleLogo from './google_g_logo.svg'
import { RaisedButton } from "material-ui";

export default class SignInButton extends Component<{}> {
  handleGoogleLogin() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        console.log('accessToken = ' + result.credential.accessToken);
      })
      .catch((error) => {
        alert(error); // or show toast
      });
  }

  render() {
    const signedIn = firebase.auth().currentUser != null;
    if (signedIn) {
      return null;
    } else {
      const googleLogoStyle = {
        width: '18px',
        height: '18px',
        marginRight: '24px'
      };
      return (
          <RaisedButton
            icon={<img src={GoogleLogo} style={googleLogoStyle} alt="Google" />}
            label="Sign in with Google"
            onClick={this.handleGoogleLogin}
          />
      );
    }
  }
}


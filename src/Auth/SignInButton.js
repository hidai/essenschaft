// @flow
import React, { Component } from 'react';
import * as firebase from 'firebase';
import GoogleLogo from './google_g_logo.svg'
import Button from "material-ui/Button";

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
          <Button
            raised
            style={{background: "white"}}
            onClick={this.handleGoogleLogin}>
            <img src={GoogleLogo} style={googleLogoStyle} alt="Google" />
            Sign in with Google
          </Button>
      );
    }
  }
}


import React, { Component } from 'react';
import * as firebase from 'firebase';
import { RaisedButton } from "material-ui";

export default class SignOutButton extends Component {
  signout() {
    firebase.auth().signOut().then(
        () => {
          // ok
        },
        (error) => {
          alert(error); // or show toast
        });
  }

  render() {
    const signedIn = firebase.auth().currentUser != null;
    if (signedIn) {
      return (
          <RaisedButton
            label="Sign out"
            onClick={this.signout}
          />
      );
    } else {
      return null;
    }
  }
}

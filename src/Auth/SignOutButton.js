// @flow
import React, { Component } from 'react';
import * as firebase from 'firebase';
import Button from "material-ui/Button";

export default class SignOutButton extends Component<{}> {
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
          <Button raised onClick={this.signout}>
            Sign out
          </Button>
      );
    } else {
      return null;
    }
  }
}

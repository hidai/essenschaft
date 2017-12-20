import React, { Component } from 'react';
import SignOutButton from '../Auth/SignOutButton'
import * as firebase from 'firebase';

class UserPage extends Component {
  render() {
    const user = firebase.auth().currentUser;
    return (
        <div>
          <div>UserPage</div>
          <ul>
            <li>{user.providerId}</li>
            <li>{user.uid}</li>
            <li>{user.displayName}</li>
            <li>{user.email}</li>
            <img src={user.photoURL} alt="user"></img>
          </ul>
          <SignOutButton></SignOutButton>
        </div>
    )
  }
}

export default UserPage;

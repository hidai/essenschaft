// @flow
import React, { Component } from 'react';
import SignInButton from '../Auth/SignInButton'

class HomePage extends Component<{}> {
  render() {
    return (
        <div>
          <div>Home</div>
          <SignInButton></SignInButton>
        </div>
    )
  }
}

export default HomePage;

import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Link, withRouter } from 'react-router-dom'
import HomePage from './HomePage'
import UserPage from './UserPage'
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const PublicRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => firebase.auth().currentUser != null
        ? <Redirect to={{pathname: '/user', state: {from: props.location}}} />
        : <Component {...props} />}
    />
  )
}

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => firebase.auth().currentUser != null
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}

class AuthEventRoute extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Signed-in: ' + JSON.stringify(user));
        this.props.history.push("/user");
      } else {
        console.log('Signed-out: ' + JSON.stringify(user));
        this.props.history.push("/");
      }
    });
  }
  render() {
    return null;
  }
}

const AuthEventRouteWithRouter = withRouter(AuthEventRoute);

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <div>
            <div>
              | <Link to="/">Home</Link> | <Link to="/user">UserPage</Link> |
            </div>
            <hr/>
            <AuthEventRouteWithRouter />
            <PublicRoute exact path="/" component={HomePage} />
            <PrivateRoute path='/user' component={UserPage} />
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}

export default App;

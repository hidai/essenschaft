import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Link, withRouter } from 'react-router-dom'
import HomePage from './HomePage'
import MenuPage from './MenuPage'
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

type Props = {
  history: Object,
};

type State = {
};

class AppRouterBase extends Component<Props, State> {
  state = {
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log('Signed-in: ' + JSON.stringify(user));
        this.props.history.push("/user");
      } else {
        console.log('Signed-out: ' + JSON.stringify(user));
        this.props.history.push("/");
      }
    });
  }

  render() {
    return (
      <div>
        <div>
          | <Link to="/">Home</Link>
          | <Link to="/menu">Menu</Link>
          | <Link to="/user">User</Link> |
        </div>
        <hr/>
        <Route path='/menu' component={MenuPage} />
        <PublicRoute exact path="/" component={HomePage} />
        <PrivateRoute path='/user' component={UserPage} />
      </div>
    )
  }
}

const AppRouter = withRouter(AppRouterBase);

class App extends Component<{}> {
  render() {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;

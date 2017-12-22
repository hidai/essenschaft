import React, { Component } from 'react';
import { BrowserRouter, Route, Link, withRouter } from 'react-router-dom'
import HomePage from './HomePage'
import MenuPage from './MenuPage'
import UserPage from './UserPage'
import PrivateRoute from '../route/PrivateRoute'
import PublicRoute from '../route/PublicRoute'
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

type Props = {
  history: Object,
};

type State = {
  user: ?Object,
};

class AppRouterBase extends Component<Props, State> {
  state = {
    user: null
  }

  constructor() {
    super();
    (this: any).isAuthorized = this.isAuthorized.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        user: user
      });
      if (user != null) {
        console.log('Signed-in: ' + JSON.stringify(user));
        this.props.history.push("/user");
      } else {
        console.log('Signed-out: ' + JSON.stringify(user));
        this.props.history.push("/");
      }
    });
  }

  isAuthorized() {
    return this.state.user != null;
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
        <Route path="/menu" component={MenuPage} />
        <PublicRoute
          exact
          path="/"
          failedPath="/user"
          component={HomePage}
          authorized={this.isAuthorized()} />
        <PrivateRoute
          path="/user"
          failedPath="/"
          component={UserPage}
          authorized={this.isAuthorized()} />
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

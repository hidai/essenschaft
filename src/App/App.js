// @flow
import React, { Component } from 'react';
import { BrowserRouter, Link, withRouter } from 'react-router-dom'
import HomePage from './HomePage'
import MenuPage from './MenuPage'
import UserPage from './UserPage'
import PrivateRoute from '../route/PrivateRoute'
import PropsRoute from '../route/PropsRoute'
import PublicRoute from '../route/PublicRoute'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import type { MenuType } from './MenuType';

type Props = {
  history: Object,
};

type State = {
  user: ?Object,
  menuList: Array<MenuType>,
};

class AppRouterBase extends Component<Props, State> {
  state = {
    user: null,
    menuList: [],
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

    const updateMenuList = (response) => {
      let menuList: Array<MenuType> = [];
      response.forEach((doc) => {
        menuList.push({
          id:         doc.id,
          name:       doc.data().name,
          imgurl:     doc.data().imgurl,
          lunchOnly:  doc.data().lunchOnly,
          lastUpdate: doc.data().lastUpdate,
        });
      });
      this.setState({
        menuList: menuList
      });
    };
    firebase.firestore().collection("menu").get().then(updateMenuList);
    firebase.firestore().collection("menu").onSnapshot(updateMenuList);
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
        <PropsRoute
          path="/menu"
          component={MenuPage}
          menuList={this.state.menuList} />
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
          authorized={this.isAuthorized()}
          user={this.state.user} />
      </div>
    )
  }
}

const AppRouter = withRouter(AppRouterBase);

class App extends Component<{}> {
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme()}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;

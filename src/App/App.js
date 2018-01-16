// @flow
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom'
import HomePage from './HomePage'
import UserPage from './UserPage'
import PrivateRoute from '../route/PrivateRoute'
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
  vendorList: Array<string>,
};

class AppRouterBase extends Component<Props, State> {
  state = {
    user: null,
    menuList: [],
    vendorList: [],
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
        this.props.history.push("/user/lunch");
      } else {
        console.log('Signed-out: ' + JSON.stringify(user));
        this.props.history.push("/");
      }
    });

    const updateMenuList = (response) => {
      let menuList: Array<MenuType> = [];
      response.forEach((doc) => {
        menuList.push({
          id:            doc.id,
          name:          doc.data().name,
          imgurl:        doc.data().imgurl,
          vendor:        doc.data().vendor,
          lunchOnly:     doc.data().lunchOnly,
          lastUpdate:    doc.data().lastUpdate,
          lastUpdatedBy: doc.data().lastUpdatedBy,
        });
      });
      this.setState({
        menuList: menuList
      });
    };
    firebase.firestore().collection("menu").get().then(updateMenuList);
    firebase.firestore().collection("menu").onSnapshot(updateMenuList);

    const updateVendorList = (response) => {
      let vendorList: Array<string> = [];
      response.forEach((doc) => {
        vendorList.push(doc.id);
      });
      this.setState({
        vendorList: vendorList
      });
    };
    firebase.firestore().collection('vendor').get().then(updateVendorList);
    firebase.firestore().collection('vendor').onSnapshot(updateVendorList);
  }

  isAuthorized() {
    return this.state.user != null;
  }

  lookupMenuFromId(id: string): ?MenuType {
    for (let i = 0; i < this.state.menuList.length; ++i) {
      const menu = this.state.menuList[i];
      if (menu.id === id) {
        return menu;
      }
    }
    return null;
  }

  lookupMenuNameFromId(id: string): string {
    const menu = this.lookupMenuFromId(id);
    return menu ? menu.name : '(unknown)';
  }

  render() {
    return (
      <div>
        <PublicRoute
          exact
          path="/"
          failedPath="/user/lunch"
          component={HomePage}
          authorized={this.isAuthorized()}
        />
        <PrivateRoute
          path="/user"
          failedPath="/"
          component={UserPage}
          authorized={this.isAuthorized()}
          user={this.state.user}
          menuList={this.state.menuList}
          lookupMenuFromId={this.lookupMenuFromId.bind(this)}
          lookupMenuNameFromId={this.lookupMenuNameFromId.bind(this)}
          vendorList={this.state.vendorList}
        />
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

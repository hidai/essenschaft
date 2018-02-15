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
  menuList: {[menuId: string]: MenuType},
  vendorList: Array<string>,
};

class AppRouterBase extends Component<Props, State> {
  state = {
    user: null,
    menuList: {},
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
        this.props.history.push('/user/lunch');
      } else {
        this.props.history.push('/');
      }
    });

    const updateMenuList = (response) => {
      let menuList = {};
      response.forEach((doc) => {
        menuList[doc.id] = {
          id:            doc.id,
          name:          doc.data().name,
          imgurl:        doc.data().imgurl,
          vendor:        doc.data().vendor,
          lunchOnly:     doc.data().lunchOnly,
          lastUpdate:    doc.data().lastUpdate,
          lastUpdatedBy: doc.data().lastUpdatedBy,
        };
        setTimeout(() => {
          this.loadCloudStorageUrl(doc.id, doc.data().name);
        }, 1);
      });
      this.setState({
        menuList: menuList
      });
    };
    firebase.firestore().collection('menu').onSnapshot(updateMenuList);

    const updateVendorList = (response) => {
      let vendorList: Array<string> = [];
      response.forEach((doc) => {
        vendorList.push(doc.id);
      });
      this.setState({
        vendorList: vendorList
      });
    };
    firebase.firestore().collection('vendor').onSnapshot(updateVendorList);
  }

  loadCloudStorageUrl(menuId: string, menuName: string) {
    firebase.storage().ref(menuId).getDownloadURL()
      .then((url) => {
        this.setState((prevState) => {
          const newMenuList = prevState.menuList;
          newMenuList[menuId].gsimgurl = url;
          return {
            menuList: newMenuList,
          };
        });
      })
      .catch((e) => {
        console.warn(`${e.message_} (name = ${menuName})`);
      });
  }

  isAuthorized() {
    return this.state.user != null;
  }

  lookupMenuNameFromId(id: string): string {
    const menu = this.state.menuList[id];
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

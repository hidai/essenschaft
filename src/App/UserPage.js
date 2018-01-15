// @flow
import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom'
import PropsRoute from '../route/PropsRoute'
import type { MenuType } from './MenuType';
import SignOutButton from '../Auth/SignOutButton'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import CalendarView from './CalendarView'
import MenuPage from './MenuPage'
import ListPage from './ListPage'
import OrderSheetToVendorPage from './OrderSheetToVendorPage'
import './UserPage.css'


type Props = {
  user: ?Object,
  menuList: Array<MenuType>,
  vendorList: Array<string>,
  lookupMenuFromId: Function,
  lookupMenuNameFromId: Function,
};

type State = {
  open: boolean,
};

class UserPage extends Component<Props, State> {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState((prevState: State) => {
      return {
        open: !prevState.open,
      }
    });
  };

  render() {
    const user = this.props.user;
    if (user == null) {
      return <span>ERROR</span>;
    }
    return (
        <div>
          <AppBar>
            <Toolbar>
              <IconButton onClick={this.handleToggle} style={{color: "white"}}>
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit">
                <Switch>
                  <Route
                    path="/user/lunch"
                    render={() => <span>Lunch Order</span>} />
                  <Route
                    path="/user/dinner"
                    render={() => <span>Dinner Order</span>} />
                  <Route
                    path="/user/menu"
                    render={() => <span>Menu</span>} />
                  <Route
                    path="/user/list"
                    render={() => <span>Weekly Order List</span>} />
                  <Route
                    path="/user/order2vendor"
                    render={() => <span>Order Sheet for Vendor</span>} />
                </Switch>
              </Typography>
            </Toolbar>
          </AppBar>

          <Drawer
            type="temporary"
            open={this.state.open}
            onClose={this.handleToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div>
              <Avatar src={user.photoURL} />
            </div>
            <div>
              {user.displayName}
            </div>
            <div>
              {user.email}
            </div>
            <SignOutButton></SignOutButton>
            <List>
              <ListItem button>
                <ListItemText primary={
                    <Link to="/user/lunch" onClick={this.handleToggle}>
                      Lunch order
                    </Link>
                  }>
                </ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemText primary={
                    <Link to="/user/dinner" onClick={this.handleToggle}>
                      Dinner order
                    </Link>
                  }>
                </ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemText primary={
                    <Link to="/user/menu" onClick={this.handleToggle}>
                      Menu
                    </Link>
                  }>
                </ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemText primary={
                    <Link to="/user/list" onClick={this.handleToggle}>
                      Weekly Order List
                    </Link>
                  }>
                </ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemText primary={
                    <Link to="/user/order2vendor" onClick={this.handleToggle}>
                      Order Sheet for Vendor
                    </Link>
                  }>
                </ListItemText>
              </ListItem>
            </List>
          </Drawer>

          <Switch>
            <PropsRoute
              exact
              path="/user/lunch"
              component={CalendarView}
              user={this.props.user}
              menuList={this.props.menuList}
              lookupMenuFromId={this.props.lookupMenuFromId}
              type="lunch"
            />
            <PropsRoute
              exact
              path="/user/dinner"
              component={CalendarView}
              user={this.props.user}
              menuList={this.props.menuList}
              lookupMenuFromId={this.props.lookupMenuFromId}
              type="dinner"
            />
            <PropsRoute
              path="/user/menu"
              component={MenuPage}
              menuList={this.props.menuList}
              vendorList={this.props.vendorList}
              editable={true}
              lookupMenuFromId={this.props.lookupMenuFromId}
            />
            <PropsRoute
              path="/user/list"
              component={ListPage}
              lookupMenuNameFromId={this.props.lookupMenuNameFromId}
            />
            <PropsRoute
              path="/user/order2vendor"
              component={OrderSheetToVendorPage}
              lookupMenuFromId={this.props.lookupMenuFromId}
            />
          </Switch>

        </div>
    )
  }
}

export default UserPage;

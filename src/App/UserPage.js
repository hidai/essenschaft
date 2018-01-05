// @flow
import React, { Component } from 'react';
import { Switch, Link } from 'react-router-dom'
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
import CalendarView from './CalendarView'
import MenuPage from './MenuPage'
import './UserPage.css'


type Props = {
  user: ?Object,
  menuList: Array<MenuType>,
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
              <IconButton aria-label="Menu" onClick={this.handleToggle}>
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit">
                Lunch order
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
            <Link to="/" onClick={this.handleToggle}>Home</Link>
            <Link to="/user" onClick={this.handleToggle}>Calendar</Link>
            <Link to="/user/menu" onClick={this.handleToggle}>Menu</Link>
          </Drawer>

          <Switch>
            <PropsRoute
              exact
              path="/user"
              component={CalendarView}
              user={this.props.user}
              menuList={this.props.menuList}
            />
            <PropsRoute
              path="/user/menu"
              component={MenuPage}
              menuList={this.props.menuList}
              editable={true}
              handleMenuClick={() => {}}
            />
          </Switch>

        </div>
    )
  }
}

export default UserPage;

// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import SignOutButton from '../Auth/SignOutButton'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import Calendar from 'react-calendar-pane';
import './UserPage.css'


const customDayRenderer = ({ handleClick, date }) => {
  return (
    <span onClick={() => handleClick(date)} >
      <span className="number">{date.format('D')}</span><br/>
      醤油ラーメン 大盛り
    </span>
  );
};

type Props = {
  user: ?Object,
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

  onSelect(date: Date, previousDate: Date, currentMonth: number) {
    alert(date);
  }

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
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/user">User</Link>
          </Drawer>

          <Calendar
            onSelect={this.onSelect}
            dayRenderer={customDayRenderer}
          />

        </div>
    )
  }
}

export default UserPage;

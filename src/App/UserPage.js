// @flow
import React, { Component } from 'react';
import SignOutButton from '../Auth/SignOutButton'
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
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
};

type State = {
  open: boolean,
};

class UserPage extends Component<Props, State> {
  state = {
    open: false
  };

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  onSelect(date: Date, previousDate: Date, currentMonth: number) {
    alert(date);
  }

  render() {
    const user = firebase.auth().currentUser;
    return (
        <div>
          <AppBar title="Lunch order"
            onLeftIconButtonClick={this.handleToggle} />
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
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

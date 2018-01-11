// @flow
import React, { Component } from 'react';
import type { MenuType } from './MenuType';
import moment from 'moment';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';

type Props = {
  menuList: Array<MenuType>,
  date: moment,
};

type State = {
  menuCount: {
    [date: moment]: {
      [menuId: string]: {
        lunch: number,
        dinner: number,
      },
    },
  },
};

class OrderSheetToVendor extends Component<Props, State> {
  state = {
    menuCount: {},
  }

  // This is a copy from ListView.js!!!!!!!!!!!
  getMenuNameFromId(id: string): string {
    for (let i = 0; i < this.props.menuList.length; ++i) {
      const menu = this.props.menuList[i];
      if (menu.id === id) {
        return menu.name;
      }
    }
    return '(unknown)';
  }

  // This is a copy from ListView.js!!!!!!!!!!!
  requestMenuIdByDate(user: string,
                      type: 'lunch' | 'dinner',
                      date: moment): Promise<?string> {
    console.log(`requestMenuIdByDate(${user}, ${type}, ${date.format('YYYY-MM-DD')})`);
    return firebase.firestore()
      .collection('order')
      .doc(user)
      .collection(date.format('YYYY-MM') + '-' + type)
      .get()
      .then((response) => {
        const day = date.format('DD');
        for (let doc of response.docs) {
          if (doc.id === day) {
            return new Promise((resolve, reject) => {
              resolve(doc.data().menuId);
            });
          }
        }
        return Promise.resolve();
      });
  }

  requestUserData(user: string) {
    console.log(`requestUserData(${user})`);
    for (let i = 0; i < 5; i++) {
      const day = this.props.date.clone().add(i, 'days');
      ['lunch', 'dinner'].forEach((type) => {
        this.requestMenuIdByDate(user, type, day)
          .then((menuId) => {
            if (!menuId) {
              return;
            }
            this.setState((prevState) => {
              let newMenuCount = prevState.menuCount;
              if (!newMenuCount.hasOwnProperty(day)) {
                newMenuCount[day] = {};
              }
              if (!newMenuCount[day].hasOwnProperty(menuId)) {
                newMenuCount[day][menuId] = {
                  lunch: 0,
                  dinner: 0,
                };
              }
              newMenuCount[day][menuId][type]++;
              return {
                menuCount: newMenuCount,
              }
            });
          });
      });
    }
  }

  fetchData() {
    firebase.firestore()
      .collection('order')
      .get()
      .then((response) => {
        this.setState({
          menuCount: {},
        });
        response.forEach((doc) => {
          this.requestUserData(doc.id);
        });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.date !== this.props.date) {
      this.fetchData();
    }
  }

  render() {
    return (
      <div>
        {
          Object.keys(this.state.menuCount).map((date) => (
            <Paper key={date}>
              <h2>{moment(date).format('l')}</h2>
              {
                Object.keys(this.state.menuCount[date]).map((menuId) => (
                  this.state.menuCount[date][menuId].lunch > 0 &&
                  <div>
                    {this.getMenuNameFromId(menuId)} x {this.state.menuCount[date][menuId].lunch}
                  </div>
                ))
              }
            </Paper>
          ))
        }
      </div>
    );
  }
}

export default OrderSheetToVendor;

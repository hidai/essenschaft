// @flow
import React, { Component } from 'react';
import Calendar from 'react-calendar-pane';
import moment from 'moment';
import type { MenuType } from './MenuType';
import * as firebase from 'firebase';

const customDayRenderer = (menuList: Array<MenuType>,
                           db: { [day: string]: Object },
                           props: Object) => {
  const day = props.date.format('DD');
  const has = db.hasOwnProperty(day);
  let name = 'no order';
  let imgurl = '';
  if (has) {
    const menuId = db[day].menuId;
    for (let i = 0; i < menuList.length; ++i) {
      const menu = menuList[i];
      if (menu.id === menuId) {
        name = menu.name;
        imgurl = menu.imgurl;
        break;
      }
    };
  }
  return (
    <span onClick={() => props.handleClick(props.date)}>
      <span className="number">{props.date.format('D')}</span><br/>
      <img src={imgurl} style={{maxWidth: "100%", maxHeight: "100%"}} />
      {name}
    </span>
  );
};

type Props = {
  user: { email: string },
  menuList: Array<MenuType>,
};

type State = {
  year: string,
  month: string,
  db: { [day: string]: Object },
  unsubscribe: Array<Function>,
};

class CalendarView extends Component<Props, State> {
  state = {
    year: moment().format('YYYY'),
    month: moment().format('MM'),
    db: {},
    unsubscribe: [],
  }

  componentDidMount() {
    if (!this.props.user) {
      return;
    }

    const emailDb = firebase.firestore()
      .collection('order')
      .doc(this.props.user.email);

    const updateDb = (response) => {
      let newDb = {};
      response.forEach((doc) => {
        newDb[doc.id] = doc.data();
      });
      this.setState({
        db: newDb,
      });
    };

    const monthKey = `${this.state.year}-${this.state.month}`;
    const monthDb = emailDb.collection(monthKey);
    this.setState((prevState) => {
      let newUnsubscribe = prevState.unsubscribe;
      newUnsubscribe.push(monthDb.get().then(updateDb));
      newUnsubscribe.push(monthDb.onSnapshot(updateDb));
      return {
        unsubscribe: newUnsubscribe,
      };
    });
  }

  onSelect(date: Date, previousDate: Date, currentMonth: number) {
    alert(date);
  }

  changeMonth() {
    this.setState((prevState) => {
      // Call unsubscribe functions
      prevState.unsubscribe.forEach((f) => {
        f();
      });
      // Clear `db` and `unsubscribe`
      return {
        db: {},
        unsubscribe: [],
      };
    });
  }

  render() {
    const date = moment(`${this.state.year}-${this.state.month}`, 'YYYY-MM');
    const dayRenderer =
        customDayRenderer.bind(null, this.props.menuList, this.state.db);
    return (
          <Calendar
            date={date}
            onSelect={this.onSelect}
            dayRenderer={dayRenderer}
            useNav={false}
          />
    );
  }
}

export default CalendarView;

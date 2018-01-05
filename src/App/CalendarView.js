// @flow
import React, { Component } from 'react';
import Calendar from 'react-calendar-pane';
import moment from 'moment';
import type { MenuType } from './MenuType';
import * as firebase from 'firebase';
import MenuChooseDialog from './MenuChooseDialog';

const customDayRenderer = (menuList: Array<MenuType>,
                           db: { [day: string]: Object },
                           props: Object) => {
  const day = props.date.format('DD');
  const has = db.hasOwnProperty(day);
  let name = 'no order';
  let imgurl = 'https://i.ytimg.com/vi/Ad9-kc9_vmE/hqdefault.jpg';
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
    <span
      onClick={() => props.handleClick(props.date)}>
      <span className="number">{props.date.format('D')}</span><br/>
      <img
        src={imgurl}
        style={{maxWidth: "15vw"}}
        alt={name} />
      <br />
      <span style={{fontSize: "75%"}}>
        {name}
      </span>
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
  menuChooseDialogOpen: boolean,
  menuChooseDialogDate: ?moment,
};

class CalendarView extends Component<Props, State> {
  state = {
    year: moment().format('YYYY'),
    month: moment().format('MM'),
    db: {},
    unsubscribe: [],
    menuChooseDialogOpen: false,
    menuChooseDialogDate: null,
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

  onSelect(date: moment, previousDate: moment, currentMonth: moment) {
    this.setState({
      menuChooseDialogOpen: true,
      menuChooseDialogDate: date,
    });
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

  getDocRef(): ?Object {
    let retv: ?Object = null;
    const date = this.state.menuChooseDialogDate;
    if (date) {
      const monthKey = date.format('YYYY-MM');
      const dayKey = date.format('DD');
      retv = firebase.firestore()
        .collection('order')
        .doc(this.props.user.email)
        .collection(monthKey)
        .doc(dayKey)
    } else {
      console.error('menuChooseDialogDate must be non-null here');
    }
    this.handleMenuChooseDialogClose();
    return retv;
  }

  handleMenuChooseDialogSelect(menuId: string, event: Event) {
    let d = this.getDocRef();
    if (d != null) {
      d.set({ menuId: menuId });
    }
  }

  handleMenuChooseDialogDelete(menuId: string, event: Event) {
    let d = this.getDocRef();
    if (d != null) {
      d.delete();
    }
  }

  handleMenuChooseDialogClose() {
    this.setState({
      menuChooseDialogOpen: false,
      menuChooseDialogDate: null,
    });
  }

  render() {
    const date = moment(`${this.state.year}-${this.state.month}`, 'YYYY-MM');
    const dayRenderer =
        customDayRenderer.bind(null, this.props.menuList, this.state.db);
    return (
          <div>
            <Calendar
              date={date}
              onSelect={this.onSelect.bind(this)}
              dayRenderer={dayRenderer}
              useNav={false}
            />
            {
              this.state.menuChooseDialogOpen &&
                <MenuChooseDialog
                  open={true}
                  date={this.state.menuChooseDialogDate}
                  menuList={this.props.menuList}
                  handleSelect={this.handleMenuChooseDialogSelect.bind(this)}
                  handleDelete={this.handleMenuChooseDialogDelete.bind(this)}
                  handleClose={this.handleMenuChooseDialogClose.bind(this)} />
            }
          </div>
    );
  }
}

export default CalendarView;

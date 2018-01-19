// @flow
import React, { Component } from 'react';
import Calendar from 'react-calendar-pane';
import moment from 'moment';
import type { MenuType } from './MenuType';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import MenuChooseDialog from './MenuChooseDialog';
import Button from 'material-ui/Button';
import IconKeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import IconKeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import type { OrderType } from './OrderType';

const customDayRenderer = (menuList: {[menuId: string]: MenuType},
                           db: { [day: string]: OrderType },
                           props: Object) => {
  let name = '';
  let imgurl: string = '';
  const key = props.date.format('YYYY-MM-DD');
  const order = db[key];
  if (order) {
    const menu = menuList[order.menuId];
    if (menu) {
      name = menu.name;
      imgurl = menu.gsimgurl || '';
    }
  }
  return (
    <div
      onClick={() => props.handleClick(props.date)}>
      <div className="number">{props.date.format('D')}</div>
      <div className="content" style={{backgroundImage: `url('${imgurl}')`}}>
        <span style={{fontSize: "75%"}}>
          {name}
        </span>
      </div>
    </div>
  );
};

type Props = {
  user: { email: string },
  menuList: {[menuId: string]: MenuType},
  vendorList: Array<string>,
  type: 'lunch' | 'dinner',
};

type State = {
  currentYearMonth: moment,
  db: {
    [day: string]: OrderType,
  },
  unsubscribe: Array<Function>,
  menuChooseDialogOpen: boolean,
  menuChooseDialogDate: ?moment,
};

class CalendarView extends Component<Props, State> {
  state = {
    currentYearMonth: moment(),
    db: {},
    unsubscribe: [],
    menuChooseDialogOpen: false,
    menuChooseDialogDate: null,
  }

  componentDidMount() {
    if (!this.props.user) {
      return;
    }
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe() {
    const handler = firebase.firestore()
      .collection('order')
      .where('userId', '==', this.props.user.email)
      .where('type', '==', this.props.type)
      .onSnapshot((response) => {
        let newDb = {};
        response.forEach((doc) => {
          newDb[doc.data().date] = doc.data();
        });
        this.setState({
          db: newDb,
        });
      });
    this.setState((prevState) => {
      let newUnsubscribe = prevState.unsubscribe;
      newUnsubscribe.push(handler);
      return {
        unsubscribe: newUnsubscribe,
      };
    });
  }

  clearDb() {
    this.setState({
      db: {},
    });
  }

  unsubscribe() {
    this.setState((prevState) => {
      // Call unsubscribe functions
      prevState.unsubscribe.forEach((f) => {
        f();
      });
      // Clear `unsubscribe`
      return {
        unsubscribe: [],
      };
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.user !== this.props.user ||
        prevProps.type !== this.props.type) {
      this.unsubscribe();
      this.clearDb();
      this.subscribe();
    }
  }

  handlePrevMonth() {
    this.unsubscribe();
    this.clearDb();
    this.subscribe();
    this.setState((prevState) => {
      return {
        currentYearMonth: prevState.currentYearMonth.subtract(1, 'months'),
      }
    });
  }

  handleNextMonth() {
    this.unsubscribe();
    this.clearDb();
    this.subscribe();
    this.setState((prevState) => {
      return {
        currentYearMonth: prevState.currentYearMonth.add(1, 'months'),
      }
    });
  }

  onSelect(date: moment, previousDate: moment, currentMonth: moment) {
    this.setState({
      menuChooseDialogOpen: true,
      menuChooseDialogDate: date,
    });
  }

  getKey(date: moment): string {
    return date.format('YYYY-MM-DD')
      + '-' + this.props.user.email
      + '-' + this.props.type;
  }

  getDocRef(date: moment): Object {
    const retv = firebase.firestore()
        .collection('order')
        .doc(this.getKey(date));
    this.handleMenuChooseDialogClose();
    return retv;
  }

  handleMenuChooseDialogSelect(menuId: string, event: Event) {
    const date = this.state.menuChooseDialogDate;
    if (date) {
      const d = this.getDocRef(date);
      if (d != null) {
        d.set({
          date: date.format('YYYY-MM-DD'),
          userId: this.props.user.email,
          type: this.props.type,
          menuId: menuId,
          lastUpdate: new Date(),
        });
      }
    }
  }

  handleMenuChooseDialogDelete(menuId: string, event: Event) {
    const date = this.state.menuChooseDialogDate;
    if (date) {
      const d = this.getDocRef(date);
      if (d != null) {
        d.delete();
      }
    }
  }

  handleMenuChooseDialogClose() {
    this.setState({
      menuChooseDialogOpen: false,
      menuChooseDialogDate: null,
    });
  }

  render() {
    const date = this.state.currentYearMonth;
    let prevMonth = date.clone().subtract(1, 'months');
    let nextMonth = date.clone().add(1, 'months');
    const dayRenderer = customDayRenderer.bind(
      null,
      this.props.menuList,
      this.state.db);
    return (
          <div>
            <div className="topButtons">
              <Button onClick={this.handlePrevMonth.bind(this)}>
                <IconKeyboardArrowLeft />
                {prevMonth.format('YYYY-MM')}
              </Button>
              <span>{date.format('YYYY-MM')}</span>
              <Button onClick={this.handleNextMonth.bind(this)}>
                {nextMonth.format('YYYY-MM')}
                <IconKeyboardArrowRight />
              </Button>
            </div>
            <Paper>
              <Calendar
                month={date}
                onSelect={this.onSelect.bind(this)}
                dayRenderer={dayRenderer}
                useNav={false}
              />
            </Paper>
            {
              this.state.menuChooseDialogOpen &&
                <MenuChooseDialog
                  open={true}
                  date={this.state.menuChooseDialogDate}
                  menuList={this.props.menuList}
                  vendorList={this.props.vendorList}
                  handleSelect={this.handleMenuChooseDialogSelect.bind(this)}
                  handleDelete={this.handleMenuChooseDialogDelete.bind(this)}
                  handleClose={this.handleMenuChooseDialogClose.bind(this)} />
            }
          </div>
    );
  }
}

export default CalendarView;

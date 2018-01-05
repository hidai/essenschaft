// @flow
import React, { Component } from 'react';
import Calendar from 'react-calendar-pane';
import moment from 'moment';
import type { MenuType } from './MenuType';
import * as firebase from 'firebase';
import MenuChooseDialog from './MenuChooseDialog';
import Button from 'material-ui/Button';
import IconKeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import IconKeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'

const customDayRenderer = (menuList: Array<MenuType>,
                           db: { [month: string]: { [day: string]: Object } },
                           props: Object) => {
  const month = props.date.format('YYYY-MM');
  const day = props.date.format('DD');
  const has = db && db.hasOwnProperty(month) && db[month].hasOwnProperty(day);
  let name = '';
  let imgurl = 'https://i.ytimg.com/vi/Ad9-kc9_vmE/hqdefault.jpg';
  if (has) {
    const menuId = db[month][day].menuId;
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
    <div
      onClick={() => props.handleClick(props.date)}>
      <div className="number">{props.date.format('D')}</div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        width: "15vw",
        height: "4em",
        overflow: "hidden",
        backgroundImage: `url('${imgurl}')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        }}>
        <span style={{fontSize: "75%"}}>
          {name}
        </span>
      </div>
    </div>
  );
};

type Props = {
  user: { email: string },
  menuList: Array<MenuType>,
};

type State = {
  currentYearMonth: moment,
  db: { [month: string]: { [day: string]: Object } },
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

  subscribe() {
    const emailDb = firebase.firestore()
      .collection('order')
      .doc(this.props.user.email);

    for (let i of [-1, 0, 1]) {
      const monthKey =
        this.state.currentYearMonth
        .clone()
        .add(i, 'months')
        .format('YYYY-MM');
      const monthDb = emailDb.collection(monthKey);

      const updateDb = (response) => {
        this.setState((prevState) => {
          let newDb = prevState.db;
          newDb[monthKey] = {};
          response.forEach((doc) => {
            newDb[monthKey][doc.id] = doc.data();
          });
          return {
            db: newDb,
          };
        });
      };

      monthDb.get().then(updateDb);
      const handler = monthDb.onSnapshot(updateDb);

      this.setState((prevState) => {
        let newUnsubscribe = prevState.unsubscribe;
        newUnsubscribe.push(handler);
        return {
          unsubscribe: newUnsubscribe,
        };
      });
    }
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

  handlePrevMonth() {
    this.unsubscribe();
    this.subscribe();
    this.setState((prevState) => {
      return {
        currentYearMonth: prevState.currentYearMonth.subtract(1, 'months'),
      }
    });
  }

  handleNextMonth() {
    this.unsubscribe();
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
    const date = this.state.currentYearMonth;
    let prevMonth = date.clone().subtract(1, 'months');
    let nextMonth = date.clone().add(1, 'months');
    const dayRenderer =
        customDayRenderer.bind(null, this.props.menuList, this.state.db);
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
            <Calendar
              month={date}
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

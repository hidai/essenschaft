// @flow
import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import moment from 'moment';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import type { OrderType } from './OrderType';
import type { MenuType } from './MenuType';

type Props = {
  date: moment,
  menuList: {[menuId: string]: MenuType},
};

type State = {
  db: {
    [vendor: string]: {
      [date: moment]: {
        [type: string]: {
          [name: string]: number,
        },
      },
    },
  },
  unsubscriber: ?Function,
};

class OrderSheetToVendor extends Component<Props, State> {
  state = {
    db: {},
    unsubscriber: undefined,
  }

  subscribe() {
    const date = this.props.date;
    const startDate = date.format('YYYY-MM-DD');
    const endDate = date.add(5, 'days').format('YYYY-MM-DD');
    const unsubscriber = firebase.firestore()
      .collection('order')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .onSnapshot((response) => {
        let newDb = {};
        response.forEach((doc) => {
          const order: OrderType = doc.data();
          const menu = this.props.menuList[order.menuId];
          const vendor = menu.vendor;
          const date = order.date;
          const name = menu.name;
          const type = order.type;
          if (!newDb.hasOwnProperty(vendor)) {
            newDb[vendor] = {};
          }
          if (!newDb[vendor].hasOwnProperty(date)) {
            newDb[vendor][date] = {};
          }
          if (!newDb[vendor][date].hasOwnProperty(type)) {
            newDb[vendor][date][type] = {};
          }
          if (!newDb[vendor][date][type].hasOwnProperty(name)) {
            newDb[vendor][date][type][name] = 0;
          }
          newDb[vendor][date][type][name]++;
        });
        this.setState({
          db: newDb,
        });
      });
    this.setState({
      unsubscriber: unsubscriber,
    });
  }

  unsubscribe() {
    if (this.state.unsubscriber) {
      this.state.unsubscriber();
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.date !== this.props.date) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  render() {
    const db = this.state.db;
    return (
      <div>
        {
          Object.keys(db).sort().map((vendor) => (
            <div key={vendor}>
              <h2>{vendor}</h2>
              {
                Object.keys(db[vendor]).sort().map((date) => (
                  Object.keys(db[vendor][date]).sort().reverse().map((type) => (
                    <Paper
                      key={vendor + '-' + date + '-' + type}
                      style={{marginBottom: "1em"}}>
                      <h2>
                        {moment(date).format('ll')} - {type}
                      </h2>
                      <List>
                        {
                          Object.keys(db[vendor][date][type]).map((name) => (
                            db[vendor][date][type][name] > 0 &&
                            <ListItem key={vendor + '-' + date + '-' + type + '-' + name}>
                              <ListItemText primary={name + " x " + db[vendor][date][type][name]} />
                            </ListItem>
                          ))
                        }
                      </List>
                    </Paper>
                  ))
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default OrderSheetToVendor;

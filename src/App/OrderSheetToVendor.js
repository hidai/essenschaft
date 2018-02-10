// @flow
import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import moment from 'moment';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import type { OrderType } from './OrderType';
import type { MenuType } from './MenuType';
import DinnerIcon from 'material-ui-icons/Brightness2'
import LunchIcon from 'material-ui-icons/Brightness5'
import Divider from 'material-ui/Divider';

type Props = {
  date: moment,
  menuList: {[menuId: string]: MenuType},
};

type State = {
  db: {
    [vendor: string]: {
      [type: string]: {
        [date: moment]: {
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
          if (!newDb[vendor].hasOwnProperty(type)) {
            newDb[vendor][type] = {};
          }
          if (!newDb[vendor][type].hasOwnProperty(date)) {
            newDb[vendor][type][date] = {};
          }
          if (!newDb[vendor][type][date].hasOwnProperty(name)) {
            newDb[vendor][type][date][name] = 0;
          }
          newDb[vendor][type][date][name]++;
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
      <Grid container direction="column">
        {
          Object.keys(db).sort().map((vendor) => (
            <Grid item key={vendor} style={{breakAfter: 'page'}}>
              <Divider />
              <h2 style={{textAlign: 'center'}}>{vendor}</h2>
              <Grid container direction="column">
                {
                  Object.keys(db[vendor]).sort().reverse().map((type) => (
                    <Grid container justify="center">
                      {
                        Object.keys(db[vendor][type]).sort().map((date) => (
                          <Grid item>
                            <Paper
                              key={vendor + '-' + date + '-' + type}
                              style={{
                                marginBottom: '1em',
                                padding: '0.1em 0.5em 0',
                              }}>
                              <h3>
                                {
                                  type === 'lunch'
                                    ? <LunchIcon style={{color: 'gold', verticalAlign: 'bottom',}} />
                                    : <DinnerIcon style={{color: 'darkgoldenrod', verticalAlign: 'bottom',}} />
                                }
                                {' '}
                                {moment(date).format('M/DD ddd')}
                              </h3>
                              <List>
                                {
                                  Object.keys(db[vendor][type][date]).map((name) => (
                                    db[vendor][type][date][name] > 0 &&
                                    <ListItem key={vendor + '-' + date + '-' + type + '-' + name}>
                                      <ListItemText primary={
                                        <span>
                                          {name}
                                          <span style={{color: 'lightgray'}}> × </span>
                                          <span style={{
                                            color: db[vendor][type][date][name] > 1 ? 'black' : 'lightgray',
                                            fontWeight: 'bold'
                                          }}>
                                            {db[vendor][type][date][name]}
                                          </span>
                                        </span>
                                      } />
                                    </ListItem>
                                  ))
                                }
                              </List>
                            </Paper>
                          </Grid>
                        ))
                      }
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          ))
        }
      </Grid>
    );
  }
}

export default OrderSheetToVendor;

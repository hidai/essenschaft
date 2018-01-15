// @flow
import React, { Component } from 'react';
import moment from 'moment';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';

type Props = {
  date: moment,
  lookupMenuNameFromId: Function,
};

type State = {
  db: {
    [date: moment]: {
      [type: string]: {
        [menuId: string]: number,
      },
    },
  },
  unsubscriber: Function,
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
          const date = order.date;
          const menuId = order.menuId;
          const type = order.type;
          if (!newDb.hasOwnProperty(date)) {
            newDb[date] = {};
          }
          if (!newDb[date].hasOwnProperty(type)) {
            newDb[date][type] = {};
          }
          if (!newDb[date][type].hasOwnProperty(menuId)) {
            newDb[date][type][menuId] = 0;
          }
          newDb[date][type][menuId]++;
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
          Object.keys(db).sort().map((date) => (
            Object.keys(db[date]).sort().reverse().map((type) => (
              <Paper
                key={date + '-' + type}
                style={{marginBottom: "1em"}}>
                <h2>
                  {moment(date).format('ll')} - {type}
                </h2>
                {
                  Object.keys(db[date][type]).map((menuId) => (
                    db[date][type][menuId] > 0 &&
                    <div>
                      {this.props.lookupMenuNameFromId(menuId)} x {db[date][type][menuId]}
                    </div>
                  ))
                }
              </Paper>
            ))
          ))
        }
      </div>
    );
  }
}

export default OrderSheetToVendor;

// @flow
import React, { Component } from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import * as firebase from 'firebase';
import type { OrderType } from './OrderType';

type Props = {
  date: moment,
  type: 'lunch' | 'dinner',
  lookupMenuNameFromId: Function,
};

type State = {
  tableData: { [userId: string]: Array<?string> },
  unsubscriber: ?Function,
};

class ListView extends Component<Props, State> {
  state = {
    tableData: {},
    unsubscriber: undefined,
  }

  unsubscribe() {
    if (this.state.unsubscriber) {
      this.state.unsubscriber();
    }
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
        let newTableData = {};
        response.forEach((doc) => {
          const order: OrderType = doc.data();
          if (this.props.type === order.type) {
            const userId = order.userId;
            if (!newTableData.hasOwnProperty(userId)) {
              newTableData[userId] = [null, null, null, null, null];
            }
            const day = moment(order.date).diff(startDate, 'days');
            newTableData[userId][day] = order.menuId;
          }
        });
        this.setState({
          tableData: newTableData,
        });
      });
    this.setState({
      unsubscriber: unsubscriber,
    });
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.type !== this.props.type ||
        prevProps.date !== this.props.date) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  render() {
    const cellStyle = {
      padding: '8px',
      textAlign: 'center',
      verticalAlign: 'middle',
    };
    let head = [];
    head.push(<TableCell key={-1} style={cellStyle}>User</TableCell>);
    for (let i = 0; i < 5; i++) {
      const day = this.props.date.clone().add(i, 'days');
      head.push(
        <TableCell key={i} style={cellStyle}>
          <div style={{whiteSpace: "nowrap"}}>{day.format('MMM Do')}</div>
          <div style={{whiteSpace: "nowrap"}}>{day.format('ddd')}</div>
        </TableCell>
      );
    }
    return (
        <div>
          <Paper>
            <Table style={{tableLayout: "fixed"}}>
              <TableHead>
                <TableRow>
                  {head}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Object.keys(this.state.tableData).map((user) => {
                    const menuNameArray = this.state.tableData[user];
                    return (
                        <TableRow key={user} hover>
                          <TableCell style={cellStyle}>
                            {user.replace(/@.*/, '')}
                          </TableCell>
                          {
                            menuNameArray.map((menuId, i) => (
                              <TableCell key={i} style={cellStyle}>
                                {
                                  menuId ? this.props.lookupMenuNameFromId(menuId) : ''
                                }
                              </TableCell>
                            ))
                          }
                        </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </Paper>
        </div>
    );
  }
}

export default ListView;

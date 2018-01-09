// @flow
import React, { Component } from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import type { MenuType } from './MenuType';
import * as firebase from 'firebase';

type Props = {
  date: moment,
  type: 'lunch' | 'dinner',
  menuList: Array<MenuType>,
};

type State = {
  tableData: { [user: string]: Array<?string> },
};

class ListView extends Component<Props, State> {
  state = {
    tableData: {},
  }

  getMenuNameFromId(id: string): string {
    for (let i = 0; i < this.props.menuList.length; ++i) {
      const menu = this.props.menuList[i];
      if (menu.id === id) {
        return menu.name;
      }
    }
    return '(unknown)';
  }

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
      this.requestMenuIdByDate(user, this.props.type, day)
        .then((menuId) => {
          this.setState((prevState) => {
            let newTableData = prevState.tableData;
            newTableData[user][i] = menuId;
            return {
              tableData: newTableData,
            }
          });
        });
    }
  }

  fetchData() {
    firebase.firestore()
      .collection('order')
      .get()
      .then((response) => {
        let newTableData = {};
        response.forEach((doc) => {
          newTableData[doc.id] = [];
        });
        this.setState({
          tableData: newTableData,
        });
        Object.keys(newTableData).forEach((user) => {
          this.requestUserData(user);
        });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.type !== this.props.type) {
      console.log(`componentDidUpdate(${prevProps.type} -> ${this.props.type})`);
      this.fetchData();
    }
  }

  render() {
    let head = [];
    head.push(<TableCell>User</TableCell>);
    for (let i = 0; i < 5; i++) {
      const day = this.props.date.clone().add(i, 'days');
      head.push(
        <TableCell>
          <div style={{whiteSpace: "nowrap"}}>{day.format('MMM')}</div>
          <div style={{whiteSpace: "nowrap"}}>{day.format('Do')}</div>
          <div style={{whiteSpace: "nowrap"}}>{day.format('ddd')}</div>
        </TableCell>
      );
    }
    return (
        <div>
          <Paper>
            <Table>
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
                        <TableRow key={user}>
                          <TableCell>{user}</TableCell>
                          {
                            menuNameArray.map((menuId, i) => (
                              <TableCell key={i}>
                                {
                                  menuId ? this.getMenuNameFromId(menuId) : ''
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

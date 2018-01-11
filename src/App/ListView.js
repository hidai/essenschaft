// @flow
import React, { Component } from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import * as firebase from 'firebase';

type Props = {
  date: moment,
  type: 'lunch' | 'dinner',
  lookupMenuNameFromId: Function,
};

type State = {
  tableData: { [user: string]: Array<?string> },
};

class ListView extends Component<Props, State> {
  state = {
    tableData: {},
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
        response.forEach((doc) => {
          this.requestUserData(doc.id);
        });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.type !== this.props.type ||
        prevProps.date !== this.props.date) {
      this.fetchData();
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

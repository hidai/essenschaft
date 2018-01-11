// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ListView from './ListView'
import { MenuItem } from 'material-ui/Menu';
import moment from 'moment';

type Props = {
  lookupMenuNameFromId: Function,
};

type State = {
  weekId: number,
  type: 'lunch' | 'dinner',
};

class ListPage extends Component<Props, State> {
  state = {
    weekId: 0,
    type: 'lunch',
  }

  updateDate(event: Object) {
    const value = event.target.value;
    this.setState({
      weekId: value,
    });
  }

  updateType(event: Object) {
    const value = event.target.value;
    this.setState({
      type: value,
    });
  }

  getMomentDateFromWeekId(weekId: number): moment {
    return moment().day(1).add(weekId, 'weeks');
  }

  render() {
    let dateArray = [];
    for (let i = -4; i < 8; ++i) {
      const day = this.getMomentDateFromWeekId(i);
      dateArray.push(
        <MenuItem key={i} value={i}>
          {day.format('ll')}
          {i === 0 && ' (this week)'}
          {i === 1 && ' (next week)'}
        </MenuItem>
      );
    }
    return (
        <div style={{marginTop: "5rem"}}>
          <div style={{display: "flex", margin: "1em 0"}}>
            <TextField
              select
              value={this.state.type}
              InputProps={{
                onChange: this.updateType.bind(this)
              }}
              style={{margin: "0 1em"}}>
              <MenuItem key="0" value="lunch">Lunch</MenuItem>
              <MenuItem key="1" value="dinner">Dinner</MenuItem>
            </TextField>
            <TextField
              select
              value={this.state.weekId}
              InputProps={{
                onChange: this.updateDate.bind(this)
              }}
              style={{margin: "0 1em"}}>
              {dateArray}
            </TextField>
          </div>
          <ListView
            date={this.getMomentDateFromWeekId(this.state.weekId)}
            type={this.state.type}
            lookupMenuNameFromId={this.props.lookupMenuNameFromId}
          />
        </div>
     );
  }
}

export default ListPage;

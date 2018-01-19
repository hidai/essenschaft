// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import moment from 'moment';
import OrderSheetToVendor from './OrderSheetToVendor';
import type { MenuType } from './MenuType';

type Props = {
  menuList: {[menuId: string]: MenuType},
};

type State = {
  weekId: number,
};

class OrderSheetToVendorPage extends Component<Props, State> {
  state = {
    weekId: 1,
    type: 'lunch',
  }

  updateDate(event: Object) {
    const value = event.target.value;
    this.setState({
      weekId: value,
    });
  }

  getMomentDateFromWeekId(weekId: number): moment {
    return moment().day(1).add(weekId, 'weeks');
  }

  render() {
    let dateArray = [];
    for (let i = -1; i < 3; ++i) {
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
              value={this.state.weekId}
              InputProps={{
                onChange: this.updateDate.bind(this)
              }}
              style={{margin: "0 1em"}}>
              {dateArray}
            </TextField>
          </div>
          <OrderSheetToVendor
            date={this.getMomentDateFromWeekId(this.state.weekId)}
            menuList={this.props.menuList}
        />
        </div>
     );
  }
}

export default OrderSheetToVendorPage;

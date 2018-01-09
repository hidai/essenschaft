// @flow
import React, { Component } from 'react';
import type { MenuType } from './MenuType';
import TextField from 'material-ui/TextField';
import ListView from './ListView'
import { MenuItem } from 'material-ui/Menu';
import moment from 'moment';

type Props = {
  menuList: Array<MenuType>,
};

type State = {
  type: 'lunch' | 'dinner',
};

class ListPage extends Component<Props, State> {
  state = {
    type: 'lunch',
  }

  updateType(event: Object) {
    const value = event.target.value;
    this.setState({
      type: value,
    });
  }

  render() {
    return (
        <div style={{marginTop: "5rem"}}>
          <div style={{margin: "1em"}}>
            <TextField
              select
              value={this.state.type}
              InputProps={{
                onChange: this.updateType.bind(this)
              }}>
              <MenuItem key="0" value="lunch">Lunch</MenuItem>
              <MenuItem key="1" value="dinner">Dinner</MenuItem>
            </TextField>
          </div>
          <ListView
            date={moment()}
            type={this.state.type}
            menuList={this.props.menuList}
          />
        </div>
     );
  }
}

export default ListPage;

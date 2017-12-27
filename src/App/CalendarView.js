// @flow
import React, { Component } from 'react';
import Calendar from 'react-calendar-pane';
import type { MenuType } from './MenuType';

const customDayRenderer = ({ handleClick, date }) => {
  return (
    <span onClick={() => handleClick(date)} >
      <span className="number">{date.format('D')}</span><br/>
      醤油ラーメン 大盛り
    </span>
  );
};

type Props = {
  user: ?Object,
  menuList: Array<MenuType>,
};

type State = {
};

class CalendarView extends Component<Props, State> {
  onSelect(date: Date, previousDate: Date, currentMonth: number) {
    alert(date);
  }

  render() {
    return (
          <Calendar
            onSelect={this.onSelect}
            dayRenderer={customDayRenderer}
          />
    );
  }
}

export default CalendarView;

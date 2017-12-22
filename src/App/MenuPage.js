// @flow
import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';

type Props = {
  menuList: Array<Object>,
};

class MenuPage extends Component<Props> {
  render() {
    let list = [];
    this.props.menuList.forEach((menu) => {
      let elem = (
          <GridTile
            key={menu.id}
            title={menu.name}>
            <img src={menu.imgurl} alt={menu.name}/>
          </GridTile>
      );
      list.push(elem);
    });
    return (
        <GridList>
          {
            list.length > 0 ? list : <span>Loading...</span>
          }
        </GridList>
    )
  }
}

export default MenuPage;

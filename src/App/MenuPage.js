// @flow
import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import AddMenuDialog from './AddMenuDialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ActionZoomOut from 'material-ui/svg-icons/action/zoom-out';
import ContentSort from 'material-ui/svg-icons/content/sort';
import type { MenuType } from './MenuType';

type Props = {
  menuList: Array<MenuType>,
};

type State = {
  gridCols: number,
  sortOrder: 'Name' | 'NameRev' | 'Date' | 'DateRev',
};

class MenuPage extends Component<Props, State> {
  state = {
    gridCols: 2,
    sortOrder: 'Name',
  }

  plusGridCols(diff: number) {
    this.setState((prevState) => {
      return {
        gridCols: prevState.gridCols + diff
      }
    });
  }

  changeToNextSortOrder() {
    this.setState((prevState: State, props: Props): Object => {
      switch (prevState.sortOrder) {
        case 'Name':
          return { sortOrder: 'NameRev' };
        case 'NameRev':
          return { sortOrder: 'Date' };
        case 'Date':
          return { sortOrder: 'DateRev' };
        case 'DateRev':
          return { sortOrder: 'Name' };
        default:
          console.warn('Invalid sortOrder: ' +
                       JSON.stringify(prevState));
          return { sortOrder: 'Name' };
      }
    });
  }

  getCompareFunc() {
    switch (this.state.sortOrder) {
      case 'Name':
      default:
        return (a: MenuType, b: MenuType): number => {
          return a.name === b.name ? 0 :
                 a.name < b.name ? -1 : 1;
        };
      case 'NameRev':
        return (a: MenuType, b: MenuType): number => {
          return a.name === b.name ? 0 :
                 a.name < b.name ? 1 : -1;
        };
      case 'Date':
        return (a: MenuType, b: MenuType): number => {
          return a.lastUpdate === b.lastUpdate ? 0 :
                 a.lastUpdate < b.lastUpdate ? -1 : 1;
        };
      case 'DateRev':
        return (a: MenuType, b: MenuType): number => {
          return a.lastUpdate === b.lastUpdate ? 0 :
                 a.lastUpdate < b.lastUpdate ? 1 : -1;
        };
    }
  }

  render() {
    let list = [];
    let sortedMenuList = this.props.menuList;
    sortedMenuList.sort(this.getCompareFunc());
    sortedMenuList.forEach((menu) => {
      let elem = (
          <GridTile
            key={menu.id}
            title={menu.name}
          >
            <img src={menu.imgurl} alt={menu.name}/>
          </GridTile>
      );
      list.push(elem);
    });
    const fabContainerStyle = {
      position: 'fixed',
      right: '1em',
      bottom: '1em',
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
    };
    const fabStyle = {
      marginLeft: '1em',
    };
    return (
        <div>
          <GridList cols={this.state.gridCols}>
            {
              list.length > 0 ? list : <span>Loading...</span>
            }
          </GridList>

          <div style={fabContainerStyle}>
            <AddMenuDialog fabStyle={fabStyle} />
            <FloatingActionButton
              mini={true}
              onClick={this.plusGridCols.bind(this, -1)}
              disabled={this.state.gridCols === 1}
              style={fabStyle}>
              <ActionZoomIn />
            </FloatingActionButton>
            <FloatingActionButton
              mini={true}
              onClick={this.plusGridCols.bind(this, +1)}
              style={fabStyle}>
              <ActionZoomOut />
            </FloatingActionButton>
            <FloatingActionButton
              mini={true}
              onClick={this.changeToNextSortOrder.bind(this)}
              style={fabStyle}>
              <ContentSort />
            </FloatingActionButton>
          </div>
        </div>
    )
  }
}

export default MenuPage;

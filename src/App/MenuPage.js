// @flow
import React, { Component } from 'react';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import AddMenuDialog from './AddMenuDialog';
import Button from 'material-ui/Button';
import IconZoomIn from 'material-ui-icons/ZoomIn';
import IconZoomOut from 'material-ui-icons/ZoomOut';
import IconSort from 'material-ui-icons/Sort';
import type { MenuType } from './MenuType';

type Props = {
  menuList: Array<MenuType>,
  vendorList: Array<string>,
  editable: boolean,
  handleMenuClick: Function,
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
          <GridListTile
            key={menu.id}
            onClick={this.props.handleMenuClick.bind(null, menu.id)}>
            <img src={menu.imgurl} alt={menu.name}/>
            <GridListTileBar title={menu.name} subtitle="菱膳">
            </GridListTileBar>
          </GridListTile>
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
          <Paper>
            <GridList cols={this.state.gridCols}>
              {
                list.length > 0 ? list : <span>Loading...</span>
              }
            </GridList>
          </Paper>

          <div style={fabContainerStyle}>
            {
              this.props.editable &&
                <AddMenuDialog
                  fabStyle={fabStyle}
                  vendorList={this.props.vendorList} />
            }
            <Button
              fab
              mini={true}
              onClick={this.plusGridCols.bind(this, -1)}
              disabled={this.state.gridCols === 1}
              style={fabStyle}>
              <IconZoomIn />
            </Button>
            <Button
              fab
              mini={true}
              onClick={this.plusGridCols.bind(this, +1)}
              style={fabStyle}>
              <IconZoomOut />
            </Button>
            <Button
              fab
              mini={true}
              onClick={this.changeToNextSortOrder.bind(this)}
              style={fabStyle}>
              <IconSort />
            </Button>
          </div>
        </div>
    )
  }
}

export default MenuPage;

// @flow
import React, { Component } from 'react';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import AddMenuButton from './AddMenuButton';
import Button from 'material-ui/Button';
import IconZoomIn from 'material-ui-icons/ZoomIn';
import IconZoomOut from 'material-ui-icons/ZoomOut';
import IconModeEdit from 'material-ui-icons/ModeEdit';
import type { MenuType } from './MenuType';

type Props = {
  menuList: Array<MenuType>,
  vendorList: Array<string>,
  editable: boolean,
  handleMenuClick: Function,
  handleEditClick: Function,
};

type State = {
  gridCols: number,
  sortOrder: 'Name' | 'VendorName' | 'Date' | 'DateRev',
};

class MenuSelector extends Component<Props, State> {
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

  updateSortOrder(event: Object) {
    const value: string = event.target.value;
    this.setState({
      sortOrder: value,
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
      case 'VendorName':
        return (a: MenuType, b: MenuType): number => {
          if (a.vendor === b.vendor) {
            return a.name === b.name ? 0 :
                   a.name < b.name ? 1 : -1;
          }
          return a.vendor < b.vendor ? 1 : -1;
        };
      case 'Date':
        return (a: MenuType, b: MenuType): number => {
          return a.lastUpdate === b.lastUpdate ? 0 :
                 a.lastUpdate < b.lastUpdate ? 1 : -1;
        };
      case 'DateRev':
        return (a: MenuType, b: MenuType): number => {
          return a.lastUpdate === b.lastUpdate ? 0 :
                 a.lastUpdate < b.lastUpdate ? -1 : 1;
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
            <GridListTileBar
              title={menu.name}
              subtitle={menu.vendor}
              actionIcon={
                this.props.editable &&
                <IconButton
                  onClick={this.props.handleEditClick.bind(null, menu.id)}
                  style={{color: "white"}}>
                  <IconModeEdit/>
                </IconButton>
              }>
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
          <div>
            <TextField
              select
              label="Sort by"
              value={this.state.sortOrder}
              InputProps={{
                onChange: this.updateSortOrder.bind(this)
              }}>
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="VendorName">Vendor | Name</MenuItem>
              <MenuItem value="Date">Last update date (new -> old)</MenuItem>
              <MenuItem value="DateRev">Last update date (old -> new)</MenuItem>
            </TextField>
            <GridList cols={this.state.gridCols}>
              {
                list.length > 0 ? list : <span>Loading...</span>
              }
            </GridList>
          </div>

          <div style={fabContainerStyle}>
            {
              this.props.editable &&
                <AddMenuButton
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
          </div>
        </div>
    )
  }
}

export default MenuSelector;

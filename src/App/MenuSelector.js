// @flow
import React, { Component } from 'react';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Subheader from 'material-ui/List/ListSubheader';
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
  menuList: {[menuId: string]: MenuType},
  vendorList: Array<string>,
  editable: boolean,
  handleMenuClick: Function,
  handleEditClick: Function,
};

type SortOrder = 'Name' | 'VendorName' | 'Date' | 'DateRev';

type State = {
  gridCols: number,
  cellHeight: number,
  sortOrder: SortOrder,
};

class MenuSelector extends Component<Props, State> {
  state = {
    gridCols: 2,
    cellHeight: 180,
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
    const value: SortOrder = event.target.value;
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

  handleResize() {
    this.setState((prevState) => {
      const elem = document.querySelector('#MenuSelector');
      if (elem) {
        const width = elem.clientWidth;// || document.documentElement.clientWidth;
        console.log("width = " + width);
        return {
          gridCols: Math.ceil(width / prevState.cellHeight),
        }
      }
    });
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render() {
    let list = [];
    let sortedMenuList = Object.keys(this.props.menuList).map((menuId) => (
        this.props.menuList[menuId]
    ));
    sortedMenuList.sort(this.getCompareFunc());
    let prevVendor = '';
    sortedMenuList.forEach((menu) => {
      if (this.state.sortOrder === 'VendorName' &&
          prevVendor !== menu.vendor) {
        list.push(
            <GridListTile key={'v-' + menu.vendor}
              cols={this.state.gridCols}
              style={{background: 'white', height: 'auto'}}>
              <Subheader component="div">{menu.vendor}</Subheader>
            </GridListTile>
        );
        prevVendor = menu.vendor;
      }
      let elem = (
          <GridListTile
            key={'m-' + (menu.id || '?')}
            onClick={this.props.handleMenuClick.bind(null, menu.id)}>
            <img src={menu.gsimgurl} alt={menu.name}/>
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
        <div id='MenuSelector'>
          <div>
            <TextField
              select
              label="Sort by"
              value={this.state.sortOrder}
              InputProps={{
                onChange: this.updateSortOrder.bind(this)
              }}
              style={{margin: '0.5em'}}>
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="VendorName">Vendor | Name</MenuItem>
              <MenuItem value="Date">Last update date (new -> old)</MenuItem>
              <MenuItem value="DateRev">Last update date (old -> new)</MenuItem>
            </TextField>
            <GridList cols={this.state.gridCols} cellHeight={this.state.cellHeight}>
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

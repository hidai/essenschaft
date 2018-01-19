// @flow
import React, { Component } from 'react';
import MenuSelector from './MenuSelector';
import MenuEditDialog from './MenuEditDialog';
import type { MenuType } from './MenuType';

type Props = {
  user: ?Object,
  menuList: {[menuId: string]: MenuType},
  vendorList: Array<string>,
  editable: boolean,
};

type State = {
  open: boolean,
  menu: ?MenuType,
}

class MenuPage extends Component<Props, State> {
  state = {
    open: false,
    menu: null,
  }

  handleEditClick(menuId: string) {
    const menu = this.props.menuList[menuId];
    if (menu != null) {
      this.setState({
        open: true,
        menu: menu,
      });
    } else {
      console.error(`${menuId} is missing in menuList`);
    }
  }

  handleClose() {
    this.setState({
      open: false,
      menu: null,
    });
  };

  render() {
    return (
        <div style={{marginTop: "4rem"}}>
          <MenuSelector
            menuList={this.props.menuList}
            vendorList={this.props.vendorList}
            editable={this.props.editable}
            handleMenuClick={() => {}}
            handleEditClick={this.handleEditClick.bind(this)}
          />
          <MenuEditDialog
            open={this.state.open}
            menu={this.state.menu}
            user={this.props.user}
            vendorList={this.props.vendorList}
            handleClose={this.handleClose.bind(this)}>
          </MenuEditDialog>
        </div>
    )
  }
}

export default MenuPage;


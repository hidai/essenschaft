// @flow
import React, { Component } from 'react';
import MenuSelector from './MenuSelector';
import MenuEditDialog from './MenuEditDialog';
import type { MenuType } from './MenuType';

type Props = {
  user: ?Object,
  menuList: Array<MenuType>,
  vendorList: Array<string>,
  editable: boolean,
  lookupMenuFromId: Function,
};

type State = {
  open: boolean,
  menu: ?MenuType,
  dbg: string
}

class MenuPage extends Component<Props, State> {
  state = {
    open: false,
    menu: null,
    dbg: '',
  }

  handleEditClick(menuId: string) {
    const menu = this.props.lookupMenuFromId(menuId);
    this.setState({
      open: true,
      menu: menu,
      dbg: `menuId = ${menuId}\n${JSON.stringify(menu, null, 2)}`,
    });
  }

  handleClose() {
    this.setState({
      open: false,
      menu: null,
      dbg: 'close',
    });
  };

  render() {
    return (
        <div>
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
          <pre>
            {this.state.dbg}
          </pre>
        </div>
    )
  }
}

export default MenuPage;


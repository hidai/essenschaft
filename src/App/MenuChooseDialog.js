// @flow
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import IconDelete from 'material-ui-icons/Delete';
import moment from 'moment';
import MenuSelector from './MenuSelector';
import type { MenuType } from './MenuType';

type Props = {
  open: boolean,
  date: moment,
  fullScreen: boolean,  // from withMobileDialog
  menuList: {[menuId: string]: MenuType},
  vendorList: Array<string>,
  handleSelect: Function,
  handleDelete: Function,
  handleClose: Function,
};

class MenuChooseDialog extends Component<Props> {
  render() {
    return (
        <div>
          <Dialog
            fullScreen={this.props.fullScreen}
            open={this.props.open}
          >
            <DialogTitle>
              Choose menu for {this.props.date.format('YYYY-MM-DD')}
            </DialogTitle>
            <DialogContent>
              <MenuSelector
                menuList={this.props.menuList}
                vendorList={this.props.vendorList}
                editable={false}
                handleMenuClick={this.props.handleSelect}
                handleEditClick={() => {}}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.props.handleDelete}
                color="primary">
                <IconDelete /> Delete
              </Button>
              <Button
                onClick={this.props.handleClose}
                color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
  }
}

export default withMobileDialog()(MenuChooseDialog);

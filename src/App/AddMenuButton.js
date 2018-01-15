// @flow
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import IconAdd from 'material-ui-icons/Add';
import MenuEditDialog from './MenuEditDialog';

type Props = {
  fabStyle: Object,
  vendorList: Array<string>,
};

type State = {
  open: boolean,
};

class AddMenuButton extends Component<Props, State> {
  state = {
    open: false,
  }

  handleOpen() {
    this.setState((prevState) => {
      if (prevState.open) {
        return {};
      } else {
        return {
          open: true,
        };
      }
    });
  };

  handleClose() {
    this.setState({open: false});
  };

  render() {
    return (
        <div>
          <MenuEditDialog
            open={this.state.open}
            vendorList={this.props.vendorList}
            handleClose={this.handleClose.bind(this)}>
          </MenuEditDialog>
          <Button
            fab
            color="accent"
            style={this.props.fabStyle}
            onClick={this.handleOpen.bind(this)}>
            <IconAdd />
          </Button>
        </div>
    );
  }
}

export default AddMenuButton;

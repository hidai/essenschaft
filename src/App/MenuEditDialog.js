// @flow
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import * as firebase from 'firebase';
import 'firebase/firestore';
import type { MenuType } from './MenuType';

type Props = {
  open: boolean,
  menu: ?MenuType,
  vendorList: Array<string>,
  handleClose: Function,
  fullScreen: boolean,  // from withMobileDialog
};

type State = {
  name: string,
  imgurl: string,
  vendor: string,
  lunchOnly: boolean,
};

class MenuEditDialog extends Component<Props, State> {
  state = {
    name: this.props.menu
      ? this.props.menu.name
      : '',
    imgurl: this.props.menu
      ? this.props.menu.imgurl
      : '',
    vendor: this.props.menu
      ? this.props.menu.vendor
      : this.props.vendorList.length > 0
        ? this.props.vendorList[0]
        : '',
    lunchOnly: this.props.menu
      ? this.props.menu.lunchOnly
      : false,
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.menu && this.props.menu) {
      this.setState({
        name: this.props.menu.name || '',
        imgurl: this.props.menu.imgurl || '',
        vendor: this.props.menu.vendor || '',
        lunchOnly: this.props.menu.lunchOnly || false,
      });
    }
    if (prevProps.menu && !this.props.menu) {
      this.setState({
        name: '',
        imgurl: '',
        vendor: this.props.vendorList.length > 0
          ? this.props.vendorList[0]
          : '',
        lunchOnly: false,
      });
    }
  }

  updateName = (event: Object) => {
    const value: string = event.target.value;
    this.setState({name: value});
  };

  updateImgurl = (event: Object) => {
    const value: string = event.target.value;
    this.setState({imgurl: value});
  };

  updateVendor = (event: Object) => {
    const value: string = event.target.value;
    this.setState({vendor: value});
  };

  updateLunchOnlyCheck = (event: Object) => {
    const value: boolean = event.target.checked;
    this.setState({lunchOnly: value});
  };

  buildMenuDoc(): MenuType {
    const doc: MenuType = {
      name: this.state.name,
      imgurl: this.state.imgurl,
      vendor: this.state.vendor,
      lunchOnly: this.state.lunchOnly,
      lastUpdate: new Date(),
    };
    return doc;
  }

  onSubmitButtonClicked() {
    const doc = this.buildMenuDoc();
    firebase.firestore()
      .collection('menu')
      .doc(this.props.menu.id)
      .set(doc)
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
    this.props.handleClose();
  };

  onAddButtonClicked() {
    const doc = this.buildMenuDoc();
    firebase.firestore()
      .collection('menu')
      .add(doc)
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
    this.props.handleClose();
  };

  render() {
    return (
        <div>
          <Dialog
            fullScreen={this.props.fullScreen}
            open={this.props.open}
          >
            <DialogTitle>
              {
                this.props.menu
                  ? 'Edit new menu item'
                  : 'Add new menu item'
              }
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Menu Name"
                value={this.state.name}
                InputProps={{
                  onChange: this.updateName
                }}
                fullWidth
              />
              <TextField
                label="URL of the menu image"
                value={this.state.imgurl}
                InputProps={{
                  onChange: this.updateImgurl
                }}
                fullWidth
              />
              <TextField
                select
                label="Vendor"
                value={this.state.vendor}
                InputProps={{
                  onChange: this.updateVendor
                }}
                fullWidth>
                {this.props.vendorList.map((i) => (
                  <MenuItem key={i} value={i}>{i}</MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.lunchOnly}
                    onChange={this.updateLunchOnlyCheck}
                  />
                }
                label="Lunch Only"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.props.handleClose}
                color="primary">
                Cancel
              </Button>
              {
                this.props.menu &&
                  <Button
                    onClick={this.onSubmitButtonClicked.bind(this)}
                    disabled={!this.state.name || !this.state.vendor}
                    color="primary">
                    Submit
                  </Button>
              }
              {
                !this.props.menu &&
                  <Button
                    onClick={this.onAddButtonClicked.bind(this)}
                    disabled={!this.state.name || !this.state.vendor}
                    color="primary">
                    Add
                  </Button>
              }
            </DialogActions>
          </Dialog>
        </div>
    );
  }
}

export default withMobileDialog()(MenuEditDialog);

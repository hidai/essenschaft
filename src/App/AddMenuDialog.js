// @flow
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import IconAdd from 'material-ui-icons/Add';
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
  fabStyle: Object,
  vendorList: Array<string>,
  fullScreen: boolean,  // from withMobileDialog
};

type State = {
  open: boolean,
  name: string,
  imgurl: string,
  vendor: string,
  lunchOnly: boolean,
};

class AddMenuDialog extends Component<Props, State> {
  state = {
    open: false,
    name: '',
    imgurl: '',
    vendor: this.props.vendorList && this.props.vendorList.length > 0
      ? this.props.vendorList[0]
      : '',
    lunchOnly: false,
  }

  handleOpen() {
    this.setState((prevState) => {
      if (prevState.open) {
        return {};
      } else {
        return {
          open: true,
          name: '',
          imgurl: '',
          vendor: '',
          lunchOnly: false,
        };
      }
    });
  };

  handleClose() {
    this.setState({open: false});
  };

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

  onAddButtonClicked = () => {
    let doc: MenuType = {
      name: this.state.name,
      imgurl: this.state.imgurl,
      vendor: this.state.vendor,
      lunchOnly: this.state.lunchOnly,
      lastUpdate: new Date(),
    };
    firebase.firestore().collection('menu').add(doc)
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
    this.handleClose();
  };

  render() {
    return (
        <div>
          <Dialog
            fullScreen={this.props.fullScreen}
            open={this.state.open}
          >
            <DialogTitle>Add new menu item</DialogTitle>
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
                onClick={this.handleClose.bind(this)}
                color="primary">
                Cancel
              </Button>
              <Button
                onClick={this.onAddButtonClicked}
                disabled={!this.state.name}
                color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
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

export default withMobileDialog()(AddMenuDialog);

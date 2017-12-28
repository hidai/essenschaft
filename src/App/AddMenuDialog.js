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
import Checkbox from 'material-ui/Checkbox';
import * as firebase from 'firebase';
import 'firebase/firestore';
import type { MenuType } from './MenuType';

type Props = {
  fabStyle: Object,
  fullScreen: boolean,  // from withMobileDialog
};

type State = {
  open: boolean,
  name: string,
  imgurl: string,
  lunchOnly: boolean,
};

class AddMenuDialog extends Component<Props, State> {
  state = {
    open: false,
    name: '',
    imgurl: '',
    lunchOnly: false,
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
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

  updateLunchOnlyCheck = (event: Object) => {
    const value: boolean = event.target.checked;
    this.setState({lunchOnly: value});
  };

  onAddButtonClicked = () => {
    let doc: MenuType = {
      name: this.state.name,
      imgurl: this.state.imgurl,
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
                onClick={this.handleClose}
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
            onClick={this.handleOpen}>
            <IconAdd />
          </Button>
        </div>
    );
  }
}

export default withMobileDialog()(AddMenuDialog);

// @flow
import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import * as firebase from 'firebase';
import 'firebase/firestore';
import MenuType from './MenuType';

type Props = {
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

  updateName = (o: Object, value: string) => {
    this.setState({name: value});
  };

  updateImgurl = (o: Object, value: string) => {
    this.setState({imgurl: value});
  };

  updateLunchOnlyCheck = (o: Object, value: boolean) => {
    this.setState({lunchOnly: value});
  };

  onAddButtonClicked = () => {
    let doc: MenuType = {
      name: this.state.name,
      imgurl: this.state.imgurl,
    };
    if (this.state.lunchOnly) {
      doc.lunchOnly = true;
    }
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
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        disabled={!this.state.name}
        onClick={this.onAddButtonClicked}
      />,
    ];
    const fabStyle = {
      position: 'fixed',
      right: '1em',
      bottom: '1em',
    };
    return (
        <div>
          <Dialog
            title="Add new menu item"
            actions={actions}
            modal={true}
            open={this.state.open}
          >
            <TextField hintText="Menu Name"
              value={this.state.name}
              onChange={this.updateName}
            />
            <TextField hintText="URL of the menu image"
              value={this.state.imgurl}
              onChange={this.updateImgurl}
            />
            <Checkbox label="Lunch Only"
              value={this.state.lunchOnly}
              onCheck={this.updateLunchOnlyCheck} />
          </Dialog>
          <FloatingActionButton
            style={fabStyle}
            onClick={this.handleOpen}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
    );
  }
}

export default AddMenuDialog;

import React, { Component } from 'react';
import * as firebase from 'firebase';
import { GridList, GridTile } from 'material-ui/GridList';
import 'firebase/firestore';

class MenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: []
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    db.collection("menu").get().then((querySnapshot) => {
      let menuList = [];
      querySnapshot.forEach((doc) => {
        menuList.push({
          id:     doc.id,
          name:   doc.data().name,
          imgurl: doc.data().imgurl
        });
      });
      this.setState({
        menuList: menuList
      });
    });
  }

  render() {
    let list = [];
    this.state.menuList.forEach((menu) => {
      let elem = (
          <GridTile
            key={menu.id}
            title={menu.name}>
            <img src={menu.imgurl} alt={menu.name}/>
          </GridTile>
      );
      list.push(elem);
    });
    return (
        <GridList>
          {
            list.length > 0 ? list : <span>Loading...</span>
          }
        </GridList>
    )
  }
}

export default MenuPage;

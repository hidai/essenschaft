// @flow
import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import AddMenuDialog from './AddMenuDialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ActionZoomOut from 'material-ui/svg-icons/action/zoom-out';

type Props = {
  menuList: Array<Object>,
};

type State = {
  gridCols: number,
};

class MenuPage extends Component<Props, State> {
  state = {
    gridCols: 2,
  }

  plusGridCols(diff: number) {
    this.setState((prevState) => {
      return {
        gridCols: prevState.gridCols + diff
      }
    });
  }

  render() {
    let list = [];
    this.props.menuList.forEach((menu) => {
      let elem = (
          <GridTile
            key={menu.id}
            title={menu.name}
          >
            <img src={menu.imgurl} alt={menu.name}/>
          </GridTile>
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
        <div>
          <GridList cols={this.state.gridCols}>
            {
              list.length > 0 ? list : <span>Loading...</span>
            }
          </GridList>

          <div style={fabContainerStyle}>
            <AddMenuDialog fabStyle={fabStyle} />
            <FloatingActionButton
              mini={true}
              onClick={this.plusGridCols.bind(this, -1)}
              disabled={this.state.gridCols == 1}
              style={fabStyle}>
              <ActionZoomIn />
            </FloatingActionButton>
            <FloatingActionButton
              mini={true}
              onClick={this.plusGridCols.bind(this, +1)}
              style={fabStyle}>
              <ActionZoomOut />
            </FloatingActionButton>
          </div>
        </div>
    )
  }
}

export default MenuPage;

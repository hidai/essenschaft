import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import renderMergedProps from './renderMergedProps'

const PrivateRoute = ({component, authorized, failedPath, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authorized
        ? renderMergedProps(component, props, rest)
        : <Redirect to={{pathname: failedPath, state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;

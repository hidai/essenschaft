import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import renderMergedProps from './renderMergedProps'

const PublicRoute = ({component, authorized, failedPath, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authorized
        ? <Redirect to={{pathname: failedPath, state: {from: props.location}}} />
        : renderMergedProps(component, props, rest)}
    />
  )
}

export default PublicRoute;

import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const PublicRoute = ({component: Component, authorized, failedPath, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authorized
        ? <Redirect to={{pathname: failedPath, state: {from: props.location}}} />
        : <Component {...props} />}
    />
  )
}

export default PublicRoute;

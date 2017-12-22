import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({component: Component, authorized, failedPath, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authorized
        ? <Component {...props} />
        : <Redirect to={{pathname: failedPath, state: {from: props.location}}} />}
    />
  )
}

export default PrivateRoute;

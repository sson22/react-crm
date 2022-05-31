/*
 * Inspired by https://stackoverflow.com/questions/47476186/when-user-is-not-logged-in-redirect-to-login-reactjs
 *
 * This is used to determine if a user is authenticated and
 * if they are allowed to visit the page they navigated to.
 *
 * If they are: they proceed to the page
 * If not: they are redirected to the login page.
 */

import { FC, Suspense } from "react";
import { Redirect, Route } from "react-router-dom";

interface Props {
  path: any;
  component: any;
  isAuthenticated: boolean;
}

const PrivateRoute: FC<Props> = ({ component: Component, isAuthenticated: isAutenticated, ...rest }) => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Route
        exact
        {...rest}
        render={(props) =>
          isAutenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
          )
        }
      />
    </Suspense>
  );
};

export default PrivateRoute;

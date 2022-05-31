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

const PublicRoute: FC<Props> = ({ component: Component, isAuthenticated: isAuthenticated, ...rest }) => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Route
        exact
        {...rest}
        render={(props) =>
          !isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
          )
        }
      />
    </Suspense>
  );
};

export default PublicRoute;

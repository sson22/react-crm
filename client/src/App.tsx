import "./App.css";

// React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// SemanticUI
import "semantic-ui-css/semantic.min.css";

// Tailwind
import "./styles/tailwind.min.css";

import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, Switch } from "react-router";
import Container from "react-bootstrap/Container";

/* Navigator */
import Navigator from "./views/Navigator";

/* Main Pages */
import Dashboard from "./views/Dashboard";
import Calendar from "./views/Calendar";

/* Login Pages */
import Login from "./views/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

/* Profile Pages */
import Profile from "./views/Profile"; // Profile page with all user information
import EditProfile from "./views/EditProfile"; // Page to edit user information
import ChangePassword from "./views/ChangePassword"; // Page to change user password from profile

/* Admin pages */
import Admin from "./views/Admin"; // Admin page with table of users (UserList)
import UserAdmin from "./views/UserAdmin"; // Admin version of profile (UserPage)
import EditUserAdmin from "./views/EditUserAdmin"; // Admin version of EditProfile (EditUserForm)
import NewUserForm from "./components/NewUserForm"; // New user

/* Customer pages */
import Customer from "./views/Customer"; // Customer list page (CustomerList)
import CustomerPageBase from "./views/CustomerPageBase"; // Page with customer info (CustomerPage)
import EditCustomer from "./views/EditCustomer"; // Customer version of EditProfile (EditCustomerForm)
import NewCustomerForm from "./components/NewCustomerForm"; // New customer
import EmailCustomerPage from "./views/EmailCustomerPage"; // Send customer message

/* Routes */
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";

import React from "react";
import { isAdmin, isLoggedIn } from "./context/Session";
import { Loader } from "semantic-ui-react";

const CRM_NAME = "AppleCRM";

const MainContainer = (props: any): JSX.Element => (
  <div>
    <Container>
      <PrivateRoute path={Dashboard.path} component={Dashboard} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute path={Calendar.path} component={Calendar} isAuthenticated={props.isAuthenticated} />

      <PrivateRoute path={Customer.path} component={Customer} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute path={CustomerPageBase.path} component={CustomerPageBase} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute path={EditProfile.path} component={EditProfile} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute path={ChangePassword.path} component={ChangePassword} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute path={NewCustomerForm.path} component={NewCustomerForm} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute path={Profile.path} component={Profile} isAuthenticated={props.isAuthenticated} />
      <PrivateRoute
        path={EmailCustomerPage.path}
        component={EmailCustomerPage}
        isAuthenticated={props.isAuthenticated}
      />
      <PrivateRoute path={EditCustomer.path} component={EditCustomer} isAuthenticated={props.isAuthenticated} />

      <AdminRoute path={Admin.path} component={Admin} isAdmin={props.isAdmin} />
      <AdminRoute path={UserAdmin.path} component={UserAdmin} isAdmin={props.isAdmin} />
      <AdminRoute path={EditUserAdmin.path} component={EditUserAdmin} isAdmin={props.isAdmin} />
      <AdminRoute path={NewUserForm.path} component={NewUserForm} isAdmin={props.isAdmin} />
    </Container>
  </div>
);

interface AppState {
  isAdmin: boolean;
  isAuthenticatingAdmin: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAdmin: false,
      isAuthenticated: false,
      isAuthenticating: true,
      isAuthenticatingAdmin: true,
    };
  }

  componentDidMount() {
    this.setState({ isAuthenticating: true, isAuthenticatingAdmin: true });
    isLoggedIn()
      .then((val: boolean) => this.setState({ isAuthenticated: val, isAuthenticating: false }))
      .catch((e: any) => {
        console.log(e);
      });
    isAdmin()
      .then((val: boolean) => this.setState({ isAdmin: val, isAuthenticatingAdmin: false }))
      .catch((e: any) => {
        console.log(e);
      });
  }

  render(): JSX.Element {
    if (this.state.isAuthenticating || this.state.isAuthenticatingAdmin) {
      return <Loader active />;
    }

    return (
      <div className="App">
        <Router>
          <Switch>
            <Redirect exact from="/" to="/dashboard" />
            <PublicRoute path={Login.path} component={Login} isAuthenticated={this.state.isAuthenticated} />
            <PublicRoute
              path={ForgotPassword.path}
              component={ForgotPassword}
              isAuthenticated={this.state.isAuthenticated}
            />
            <PublicRoute
              path={ResetPassword.path}
              component={ResetPassword}
              isAuthenticated={this.state.isAuthenticated}
            />

            <div>
              <Navigator logoTitle={CRM_NAME} isAdmin={this.state.isAdmin} />
              <br />
              <MainContainer isAdmin={this.state.isAdmin} isAuthenticated={this.state.isAuthenticated} />
            </div>
          </Switch>
        </Router>
      </div>
    );
  }
}

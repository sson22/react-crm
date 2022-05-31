import React from "react";
import "dotenv/config";

import { Icon, Divider, Header, Button, Loader, Segment } from "semantic-ui-react";

import CustomerListCSS from "./CustomerList.module.css";
import axios from "axios";
import UserAdmin from "../views/UserAdmin";

interface UserPageState {
  location: string;
  pageTitle: string;
  isloading: boolean;
  _id: string;
  name: string;
  email: string;
}

/** This page shows all the information for the user (used in profile and admin
 *  view pages) - is not used for customer even though they are incredibly similar -
 *  should try and make them into one page at some point
 */
export default class UserPage extends React.Component<any, UserPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      location: this.props.location, // Page route?
      pageTitle: this.props.pageTitle,
      isloading: true, // While the page is loading the little loading icon will appear?
      _id: this.props._id, // User's id
      name: "",
      email: "",
    };
  }

  // Loads these components before the page renders
  componentDidMount() {
    this.getUserInfo();
  }

  // Get user information and set it to the state variables
  getUserInfo(): void {
    this.setState({ isloading: true });
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/userById/" + this.state._id)
      .then((response) => {
        this.setState({ name: response.data.name, email: response.data.email, isloading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render(): JSX.Element {
    // If page is still loading, show loader on tab
    if (this.state.isloading) {
      return <Loader active />;
    }

    return (
      <div className="component">
        <div className={CustomerListCSS.flexContainer}>
          <div>
            <Header as="h2">
              <Icon name="user" />
              <Header.Content> {this.state.pageTitle} </Header.Content>
            </Header>
          </div>
          <div>
            <Button
              basic
              color="blue"
              onClick={() => {
                window.location.href = this.state.location + "/edit"; // EditUserForm component
              }}
            >
              <p>Edit</p>
            </Button>
            {this.state.pageTitle != UserAdmin.heading && (
              <Button
                basic
                color="blue"
                onClick={() => {
                  window.location.href = this.state.location + "/change-password"; // ChangePasswordForm component
                }}
              >
                <p>Change Password</p>
              </Button>
            )}
          </div>
        </div>
        <Divider />
        <Segment>
          <Header as="h3">Name</Header>
          <p>{this.state.name}</p>
          <Divider />
          <Header as="h3">Email</Header>
          <p>{this.state.email}</p>
          {this.state.pageTitle != UserAdmin.heading && (
            <div>
              <Divider />
              <Header as="h3">Password</Header>
              <p>********</p>
            </div>
          )}
        </Segment>
        <Divider />
      </div>
    );
  }
}

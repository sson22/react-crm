import React from "react";
import axios from "axios";
import "dotenv/config";

import { Input, Icon, Table, Header, Button, Dropdown, Checkbox, Popup, Loader } from "semantic-ui-react";
import NewUserForm from "./NewUserForm";
import CustomerListCSS from "./CustomerList.module.css";
import { dynamicSort } from "../util/dynamicSort";

interface IUser {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
}

interface IUserListState {
  users: any;
  value: string;
  issearchloading: boolean;
  isusersloading: boolean;
  selecteduser: IUser;
  anyUsersChecked: boolean;
}

// Page route (used to get to UserPage)
interface IUserListProps {
  location: string;
}

/**
 * This class creates the table of users in the admin page. Extremely similar
 * to the CustomerList, should try and unify them if we can
 */
export default class UserList extends React.Component<IUserListProps, IUserListState> {
  timeoutRef: ReturnType<typeof setTimeout>;
  checkedusers: string[]; // An array of userids in the form of strings.

  constructor(props: any) {
    super(props);

    this.state = {
      issearchloading: false, // Loading thing on icon?
      isusersloading: true,
      value: "",
      users: [],
      selecteduser: { _id: "", name: "", email: "", admin: false },
      anyUsersChecked: false,
    };

    // Timeout used to see if admin has finished typing in the search bar
    this.timeoutRef = setTimeout(function () {
      /* snip */
    }, 1);

    this.checkedusers = [];

    this.userList = this.userList.bind(this);
    this.sortFunc = this.sortFunc.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  // The User object
  User = (props: any) => (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          checkbox
          onChange={() => {
            // An array of strings of userids. If it's not checked, it'll remove the id, if checked it'll add it.
            this.checkedusers.includes(props.user._id)
              ? (this.checkedusers = this.checkedusers.filter((item: any) => item !== props.user._id))
              : this.checkedusers.push(props.user._id);

            // This is to disable and enable the delete button.
            this.setState({ anyUsersChecked: this.checkedusers.length != 0 });
          }}
        />
      </Table.Cell>
      <Table.Cell>{props.user.name}</Table.Cell>
      <Table.Cell>{props.user.email}</Table.Cell>
      <Table.Cell>{props.user.admin ? <Icon name="checkmark" /> : <Icon name="close" />}</Table.Cell>
      <Table.Cell>
        <Button primary fluid icon="edit" size="mini" onClick={() => this.handleRowClick(props.user._id)} />
      </Table.Cell>
    </Table.Row>
  );

  // Loads these components before the page renders
  componentDidMount(): void {
    this.getAllUser();
  }

  // Redirects to the UserPage when you click a row on the userlist
  handleRowClick(id: string): void {
    console.log(id);
    window.location.href = this.props.location + "/page/" + id; // UserPage
  }

  // Deletes an user
  deleteUser(id: string): void {
    axios
      .delete(process.env.REACT_APP_HOST_URL + "users/removeUser/" + id)
      .then(() => {
        this.getAllUser(); // This will set the state.
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Loop through selected users and delete using deleteUser */
  deleteSelectedUsers(): void {
    this.checkedusers.forEach((e) => {
      console.log(e);
      this.deleteUser(e);
    });
  }

  // TODO: This was replaced with a util function??
  adminUser(id: string): void {
    axios
      .post(process.env.REACT_APP_HOST_URL + "users/updateAdmin/" + id)
      .then(() => {
        this.getAllUser(); // This will update the state.
      })
      .catch((error) => {
        console.log(error);
      });
  }

  adminSelectedUser(): void {
    this.checkedusers.forEach((e) => {
      this.adminUser(e);
    });
  }

  //Fetch all the customer list from the database.
  getAllUser(): void {
    this.setState({ isusersloading: true });
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/")
      .then((response) => {
        this.setState({ users: response.data, isusersloading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Returns the information for the user table
  userList(): JSX.Element[] {
    return this.state.users.map((curruser: any) => {
      return <this.User user={curruser} key={curruser._id} />;
    });
  }

  // Searches for user by enterred string (in search bar)
  userSearch(text: string): void {
    this.setState({ isusersloading: true });
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/search/" + text)
      .then((response) => {
        this.setState({ isusersloading: false, users: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Function that makes sure that the user has finished typing the string
     in the search bar */
  handleSearchChange = (event: any) => {
    clearTimeout(this.timeoutRef);
    this.setState({ issearchloading: true, value: event.target.value });
    this.timeoutRef = setTimeout(() => {
      if (event.target.value.length == 0) {
        this.getAllUser();
        this.setState({ issearchloading: false, value: "" });
        return;
      }
      this.userSearch(event.target.value);
      this.setState({ issearchloading: false });
    }, 500);
  };

  sortFunc(e: any, { value }: any): void {
    this.setState(this.state.users.sort(dynamicSort(value)));
  }

  render(): JSX.Element {
    const dropdownOptions = [
      { key: 1, text: "Admin", value: "-admin" },
      { key: 2, text: "Name (A-Z)", value: "name" },
      { key: 3, text: "Name (Z-A)", value: "-name" },
      { key: 4, text: "Email (A-Z)", value: "email" },
      { key: 5, text: "Email (Z-A)", value: "-email" },
    ];

    return (
      <div className="component">
        <Header as="h2">
          <Icon name="users" />
          <Header.Content>User List</Header.Content>
        </Header>

        <div className={CustomerListCSS.flexContainer}>
          <div>
            <Dropdown
              floated="right"
              options={dropdownOptions}
              placeholder="Sort by..."
              onChange={(e, { value }) => this.sortFunc(e, { value })}
              selection
            />
          </div>
          <div>
            <Input
              placeholder="Search by Name..."
              loading={this.state.issearchloading}
              icon="search"
              onChange={this.handleSearchChange}
              value={this.state.value}
            />
          </div>
          <div>
            <Button color="blue" href={NewUserForm.path}>
              New
            </Button>

            {/* If there's no one checked then keep button disabled. */}
            {/* --- Admin Toggle Users --- */}
            {this.state.anyUsersChecked ? (
              <Popup
                trigger={
                  <Button
                    color="blue"
                    onClick={() => {
                      window.location.reload();
                      this.adminSelectedUser();
                    }}
                  >
                    Admin
                  </Button>
                }
                content="Flips the admin status of the currently checked users."
                mouseEnterDelay={800}
              />
            ) : (
              <Button disabled>Admin</Button>
            )}

            {/* --- Deleting Users --- */}
            {this.state.anyUsersChecked ? (
              <Popup
                trigger={
                  <Button
                    color="blue"
                    onClick={() => {
                      window.location.reload();
                      this.deleteSelectedUsers();
                    }}
                  >
                    Delete
                  </Button>
                }
                content="Warning! This action cannot be undone."
              />
            ) : (
              <Button disabled>Delete</Button>
            )}
          </div>
        </div>

        <Table striped celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Admin</Table.HeaderCell>
              <Table.HeaderCell>View</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.state.isusersloading ? <Loader active /> : <Table.Body className="">{this.userList()}</Table.Body>}
        </Table>
      </div>
    );
  }
}

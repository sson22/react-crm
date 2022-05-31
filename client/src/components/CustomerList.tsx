import React from "react";
import axios from "axios";
import "dotenv/config";

import { Input, Icon, Table, Header, Button, Dropdown, Popup, Checkbox, Loader } from "semantic-ui-react";
import { dynamicSort } from "../util/dynamicSort";

import NewCustomerForm from "./NewCustomerForm";

import CustomerListCSS from "./CustomerList.module.css";

// Interface for customer
interface ICustomer {
  _id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  favourite: boolean;
}

// Interface for customer table
interface ICustomersState {
  customers: any;
  value: string;
  issearchloading: boolean;
  iscustomersloading: boolean;
  dropdownValue: { colName: string; direction: string };
  anyCustomersChecked: boolean;
}

// Page route (used to get to CustomerPage)
interface ICustomerListProps {
  location: string;
}

/**
 * This class creates the table of customers in the customer page. Extremely similar
 * to the UserList, should try and unify them if we can
 */
export default class Customers extends React.Component<ICustomerListProps, ICustomersState> {
  timeoutRef: ReturnType<typeof setTimeout>;
  checkedcustomers: string[]; // An array of customerids in the form of strings.

  constructor(props: any) {
    super(props);

    this.state = {
      issearchloading: false, // Loading thing on icon?
      iscustomersloading: true,
      value: "",
      customers: [],
      dropdownValue: { colName: "", direction: "" },
      anyCustomersChecked: false,
    };

    // Timeout used to see if user has finished typing in the search bar
    this.timeoutRef = setTimeout(function () {
      /* snip */
    }, 1);

    this.checkedcustomers = [];

    this.customerList = this.customerList.bind(this);
    this.sortFunc = this.sortFunc.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  // The Customer object
  Customer = (props: any) => (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox
          checkbox
          onChange={() => {
            // An array of strings of customer ids. If it's not checked, it'll remove the id, if checked it'll add it.
            this.checkedcustomers.includes(props.customer._id)
              ? (this.checkedcustomers = this.checkedcustomers.filter((item: any) => item !== props.customer._id))
              : this.checkedcustomers.push(props.customer._id);

            // This is to disable and enable the delete button.
            this.setState({ anyCustomersChecked: this.checkedcustomers.length != 0 });
          }}
        />
      </Table.Cell>
      <Table.Cell>{props.customer.name}</Table.Cell>
      <Table.Cell>{props.customer.company}</Table.Cell>
      <Table.Cell>{props.customer.email}</Table.Cell>
      <Table.Cell>{props.customer.phone}</Table.Cell>
      <Table.Cell>{props.customer.favourite ? <Icon name="star" /> : <Icon name="star outline" />}</Table.Cell>
      <Table.Cell>
        <Button primary fluid icon="edit" size="mini" onClick={() => this.handleRowClick(props.customer._id)} />
      </Table.Cell>
    </Table.Row>
  );

  // Loads these components before the page renders
  componentDidMount(): void {
    this.getAllCustomer();
  }

  // Redirects to the CustomerPage when you click a row on the customerlist
  handleRowClick(id: string): void {
    console.log(id);
    window.location.href = this.props.location + "/page/" + id; // CustomerPage
  }

  // Deletes a customer
  deleteCustomer(id: string): void {
    axios
      .delete(process.env.REACT_APP_HOST_URL + "customer/removeCustomer/" + id)
      .then(() => {
        this.getAllCustomer(); // This will update the state.
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Loops through list of selected customers and deletes using deleteCustomer function
  deleteSelectedCustomers(): void {
    this.checkedcustomers.forEach((e) => {
      this.deleteCustomer(e);
    });
  }

  favouriteCustomer(id: string): void {
    axios
      .post(process.env.REACT_APP_HOST_URL + "customer/favourite/" + id)
      .then(() => {
        this.getAllCustomer(); // This will update the state.
      })
      .catch((error) => {
        console.log(error);
      });
  }

  favouriteSelectedCustomers(): void {
    this.checkedcustomers.forEach((e) => {
      this.favouriteCustomer(e);
    });
  }

  //Fetch all the customer list from the database.
  getAllCustomer(): void {
    this.setState({ iscustomersloading: true });
    axios
      .get(process.env.REACT_APP_HOST_URL + "customer/")
      .then((response) => {
        this.setState({ iscustomersloading: false, customers: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Returns the table for the customer list
  customerList(): JSX.Element[] {
    return this.state.customers.map((currcustomer: ICustomer) => {
      return <this.Customer customer={currcustomer} key={currcustomer._id} />;
    });
  }

  // Searches for customer by enterred string (in search bar)
  customerSearch(text: string): void {
    this.setState({ iscustomersloading: true });
    axios
      .get(process.env.REACT_APP_HOST_URL + "customer/search/" + text)
      .then((response) => {
        this.setState({ iscustomersloading: false, customers: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Function that makes sure that the user has finished typing the string
     in the search bar */
  handleSearchChange = (event: any) => {
    // console.log(event);
    clearTimeout(this.timeoutRef);
    this.setState({ issearchloading: true, value: event.target.value });
    this.timeoutRef = setTimeout(() => {
      if (event.target.value.length == 0) {
        this.getAllCustomer();
        this.setState({ issearchloading: false, value: "" });
        return;
      }
      this.customerSearch(event.target.value);
      this.setState({ issearchloading: false });
    }, 500);
  };

  sortFunc(e: any, { value }: any): void {
    this.setState(this.state.customers.sort(dynamicSort(value)));
  }

  render(): JSX.Element {
    const dropdownOptions = [
      { key: 1, text: "Favourites", value: "-favourite" },
      { key: 2, text: "Name (A-Z)", value: "name" },
      { key: 3, text: "Name (Z-A)", value: "-name" },
      { key: 4, text: "Company (A-Z)", value: "company" },
      { key: 5, text: "Company (Z-A)", value: "-company" },
      { key: 6, text: "Email (A-Z)", value: "email" },
      { key: 7, text: "Email (Z-A)", value: "-email" },
      { key: 8, text: "Phone (0-9)", value: "phone" },
      { key: 9, text: "Phone (9-0)", value: "-phone" },
    ];

    return (
      <div>
        <Header as="h2">
          <Icon name="address book" />
          <Header.Content>Customer List</Header.Content>
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
            <Button color="blue" href={NewCustomerForm.path}>
              New
            </Button>
            {/* If there's no one checked then keep button disabled. */}

            {/* TODO: idk how to combine these two statements into one. */}
            {/* --- Favouriting Customers --- */}
            {this.state.anyCustomersChecked ? (
              <Popup
                trigger={
                  <Button
                    color="blue"
                    onClick={() => {
                      window.location.reload();
                      this.favouriteSelectedCustomers();
                    }}
                  >
                    Favourite
                  </Button>
                }
                content="Flips the favourite status of the currently checked customers."
                mouseEnterDelay={800}
              />
            ) : (
              <Button disabled>Favourite</Button>
            )}

            {/* --- Deleting Customers --- */}
            {this.state.anyCustomersChecked ? (
              <Popup
                trigger={
                  <Button
                    color="blue"
                    onClick={() => {
                      window.location.reload();
                      this.deleteSelectedCustomers();
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

        <Table celled selectable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Favourite</Table.HeaderCell>
              <Table.HeaderCell>View</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.state.iscustomersloading ? (
            <Loader active />
          ) : (
            <Table.Body className="">{this.customerList()}</Table.Body>
          )}
        </Table>
      </div>
    );
  }
}

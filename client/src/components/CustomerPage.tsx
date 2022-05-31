import React from "react";
import "dotenv/config";

import { Icon, Divider, Header, Button, Loader, Segment, Breadcrumb } from "semantic-ui-react";

import CustomerListCSS from "./CustomerList.module.css";
import axios from "axios";

interface CustomerPageState {
  location: string;
  pageTitle: string;
  isloading: boolean;
  _id: string;
  name: string;
  company: string;
  phone: number;
  email: string;
  favourite: boolean;
}

/** This page shows all the information for the customer (used in customer page)
 *  This is not used for customer even though they are incredibly similar, we
 *  should try and make them into one page at some point
 */
export default class CustomerPage extends React.Component<any, CustomerPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      location: this.props.location,
      pageTitle: this.props.pageTitle,
      isloading: true,
      _id: this.props._id,
      name: "",
      company: "",
      phone: 0,
      email: "",
      favourite: false,
    };
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
  }

  // Loads these components before the page renders
  componentDidMount() {
    this.getCustomerInfo();
  }

  // Get customer information and set it to the state variables
  getCustomerInfo(): void {
    this.setState({ isloading: true });
    axios
      .get(process.env.REACT_APP_HOST_URL + "customer/find-one/" + this.state._id)
      .then((response) => {
        this.setState({
          name: response.data.name,
          company: response.data.company,
          phone: response.data.phone,
          email: response.data.email,
          favourite: response.data.favourite,
          isloading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Used to make true/false print as True/False
  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  sections = [
    { key: "Customer List", content: "Customer List", link: true, href: "/customerList" },
    { key: "View Customer", content: "View Customer", active: false },
  ];

  render(): JSX.Element {
    // If page is still loading, show loader on tab
    if (this.state.isloading) {
      return <Loader active />;
    }

    return (
      <div>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>
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
                  // EmailCustomer -> Doesn't exist yet
                  window.location.href = this.state.location + "/email";
                }}
              >
                <p>Email Customer</p>
              </Button>
              <Button
                basic
                color="blue"
                onClick={() => {
                  // EditCustomerForm -> Doesn't exist yet
                  window.location.href = this.state.location + "/edit";
                }}
              >
                <p>Edit</p>
              </Button>
            </div>
          </div>
          <Divider />
          <Segment>
            <Header as="h3">Name</Header>
            <p>{this.state.name}</p>
            <Divider />
            <Header as="h3">Company</Header>
            <p>{this.state.company}</p>
            <Divider />
            <Header as="h3">Phone</Header>
            <p>{this.state.phone}</p>
            <Divider />
            <Header as="h3">Email</Header>
            <p>{this.state.email}</p>
            <Divider />
            <Header as="h3">Favourite Status</Header>
            <p>{this.state.favourite ? <Icon name="star" /> : <Icon name="star outline" />}</p>
          </Segment>
        </div>
      </div>
    );
  }
}

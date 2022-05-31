import React from "react";
import axios from "axios";
import { Form, Button, Header, Icon, Loader, Checkbox, Breadcrumb, Divider } from "semantic-ui-react";

interface ThisState {
  isloading: boolean;
  issending: boolean;
  isupdated: boolean;
  name: string;
  company: string;
  phone: number;
  email: string;
  favourite: boolean;
  _id: string;
}

/* Component called by EditCustomer which allows you to edit customer */
export default class EditCustomerForm extends React.Component<Record<string, any>, ThisState> {
  timeoutRef: ReturnType<typeof setTimeout>;
  constructor(props: Record<string, never>) {
    super(props);

    // Every time these functions are called, they are variable is set to the new value
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeFavourite = this.onChangeFavourite.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isloading: true,
      issending: false,
      isupdated: false,
      _id: this.props._id,
      name: "",
      company: "",
      phone: 0,
      email: "",
      favourite: false,
    };

    this.timeoutRef = setTimeout(function () {
      /* snip */
    }, 1);
  }

  // Loads these components before the page renders
  componentDidMount() {
    this.getCustomerInfo();
  }

  /* OnChange Functions -> Changes the value of the state variables
   (customer information) everytime they are changed */
  onChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: e.target.value,
      isupdated: false,
    });
  }

  onChangeCompany(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      company: e.target.value,
      isupdated: false,
    });
  }

  onChangePhone(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      phone: Number(e.target.value),
      isupdated: false,
    });
  }

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      email: e.target.value,
      isupdated: false,
    });
  }

  // Favourite should be star
  onChangeFavourite(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      favourite: Boolean(e.target.value),
      isupdated: false,
    });
  }

  // Handles favourite
  handleCheck() {
    console.log("Handle Check!");
    console.log(this.state.favourite);
    this.state.favourite ? this.setState({ favourite: false }) : this.setState({ favourite: true });
  }

  // Save changes on submit, and return to customer list
  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    clearTimeout(this.timeoutRef);
    this.setState({ issending: true });
    this.timeoutRef = setTimeout(() => {
      const customer = {
        name: this.state.name,
        company: this.state.company,
        phone: this.state.phone,
        email: this.state.email,
        favourite: this.state.favourite,
        _id: this.state._id,
      };
      axios
        .post(process.env.REACT_APP_HOST_URL + "customer/edit", customer)
        .then((res) => {
          window.location.href = "/customerList";
        })
        .catch((e) => console.error(e));
      this.setState({ issending: false, isupdated: true });
    }, 500);
  }

  // Gets information for the customer
  getCustomerInfo(): void {
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
        console.log("Fetched cust info on editCustomer: " + response.data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sections = [
    { key: "Customer List", content: "Customer List", link: true, href: "/customerList" },
    { key: "View Customer", content: "View Customer", link: true, href: "/customerList/page/" + this.props._id },
    { key: "Edit", content: "Edit", active: false },
  ];

  render(): JSX.Element {
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
          <Header as="h2">
            <Icon name="user" />
            <Header.Content>Edit Customer Details</Header.Content>
          </Header>
          <br />

          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <label>Name: </label>
              <input
                type="text"
                placeholder="Name"
                required
                className="form-control"
                value={this.state.name}
                onChange={this.onChangeName}
              />
              <br />

              <label>Company: </label>
              <input
                type="text"
                placeholder="Company"
                required
                className="form-control"
                value={this.state.company}
                onChange={this.onChangeCompany}
              />
              <br />

              <label>Phone Number: </label>
              <input
                type="text"
                placeholder="Phone Number"
                required
                className="form-control"
                value={this.state.phone}
                onChange={this.onChangePhone}
              />
              <br />

              <label>Email: </label>
              <input
                type="text"
                placeholder="Email"
                required
                className="form-control"
                value={this.state.email}
                onChange={this.onChangeEmail}
              />
              <br />

              <label>Favourite Status: </label>
              <Checkbox
                checked={this.state.favourite}
                label="Favourite"
                onChange={() => {
                  this.handleCheck();
                }}
              />
              {/* <TextButton onChange={() => {
                  this.handleCheck();
                }}
              >
                {this.state.favourite ? <Icon name="star" /> : <Icon name="star outline" />}
              </TextButton> */}
              <br />
              <br />
            </Form.Field>
            <Button color="blue" disabled={this.state.issending}>
              {this.state.issending ? "Loading..." : this.state.isupdated ? "Saved!" : "Update"}
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

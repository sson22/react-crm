import React from "react";
import "dotenv/config";

import { Form, Checkbox, Button, Header, Icon, Breadcrumb, Divider } from "semantic-ui-react";

import axios from "axios";

interface ThisState {
  name: string;
  company: string;
  phone: string;
  email: string;
  favourite: boolean;
}

export default class NewCustomerForm extends React.Component<Record<string, never>, ThisState> {
  static readonly path = "/customerList/createCustomer";

  constructor(props: Record<string, never>) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeFavourite = this.onChangeFavourite.bind(this);

    this.state = {
      name: "",
      company: "",
      phone: "",
      email: "",
      favourite: false,
    };
  }

  onChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeCompany(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      company: e.target.value,
    });
  }

  onChangePhone(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      phone: e.target.value,
    });
  }

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      email: e.target.value,
    });
  }

  onChangeFavourite(): void {
    this.setState({ favourite: !this.state.favourite });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const customer = {
      name: this.state.name,
      company: this.state.company,
      phone: this.state.phone,
      email: this.state.email,
      favourite: this.state.favourite,
    };

    console.log(customer);

    axios
      .post(process.env.REACT_APP_HOST_URL + "customer/createCustomer", customer)
      .then((res) => {
        console.log(res.data);
        window.location.href = "/customerList";
      })
      .catch((e) => console.error(e));

    this.setState({
      name: "",
      company: "",
      phone: "",
      email: "",
      favourite: false,
    });
  }

  handleCheck() {
    this.state.favourite ? this.setState({ favourite: false }) : this.setState({ favourite: true });
  }

  sections = [
    { key: "Customer List", content: "Customer List", link: true, href: "/customerList" },
    { key: "Add New", content: "Add New", active: false },
  ];

  render(): JSX.Element {
    return (
      <div>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>

        <div className="component">
          <Header as="h2">
            <Icon name="address card" />
            <Header.Content>New Customer</Header.Content>
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

              <label>Phone: </label>
              <input
                type="text"
                placeholder="Phone"
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

              <Checkbox
                label="Favourite"
                onChange={() => {
                  this.handleCheck();
                }}
              />
              <br />
            </Form.Field>
            <Button color="blue">Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

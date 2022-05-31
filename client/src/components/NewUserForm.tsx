import React from "react";
import "dotenv/config";

import { Form, Button, Header, Icon, Breadcrumb, Divider, Checkbox } from "semantic-ui-react";

import axios from "axios";

interface ThisState {
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

export default class NewUserForm extends React.Component<Record<string, never>, ThisState> {
  static readonly path = "/admin/createUser";
  static readonly title = "AppleCRM - Add User";

  constructor(props: Record<string, never>) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeAdmin = this.onChangeAdmin.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: "",
      email: "",
      password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
      admin: false,
    };
  }

  onChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      password: e.target.value,
    });
  }

  onChangeAdmin(): void {
    // console.log(!this.state.admin);
    this.setState({ admin: !this.state.admin });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      admin: this.state.admin,
    };

    /* Create the user, then send user a new email */
    axios
      .post(process.env.REACT_APP_HOST_URL + "users/createUser", user)
      .then((res) => {
        console.log(res.data);
        return axios.post(process.env.REACT_APP_HOST_URL + "users/email-new-user", user);
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.error(e));

    this.setState({
      name: "",
      email: "",
      password: "",
    });
  }

  sections = [
    { key: "User List", content: "User List", link: true, href: "/admin" },
    { key: "Add New", content: "Add New", active: false },
  ];

  render(): JSX.Element {
    return (
      <div>
        <title>{NewUserForm.title}</title>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>

        <div className="component">
          <Header as="h2">
            <Icon name="address card" />
            <Header.Content>New User</Header.Content>
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

              <label>Password: </label>
              <input
                type="text"
                placeholder="Insert Temporary Password here"
                required
                className="form-control"
                value={this.state.password}
                onChange={this.onChangePassword}
              />
              <br />
              <Checkbox label="Admin" onChange={this.onChangeAdmin} />

              <br />
            </Form.Field>
            <Button color="blue">Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

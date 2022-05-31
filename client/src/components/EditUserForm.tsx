import React from "react";

import { Form, Button, Header, Icon, Loader } from "semantic-ui-react";

import axios from "axios";

interface ThisState {
  isloading: boolean;
  issending: boolean;
  isupdated: boolean;
  _id: string;
  redirect: string;
  name: string;
  email: string;
}

/* Component called by EditUserAdmin and EditProfile which allows you to edit user */
export default class EditUserForm extends React.Component<Record<string, any>, ThisState> {
  timeoutRef: ReturnType<typeof setTimeout>;
  constructor(props: Record<string, never>) {
    super(props);

    // Every time these functions are called, they are variable is set to the new value
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isloading: true,
      issending: false,
      isupdated: false,
      _id: this.props._id,
      redirect: this.props.redirect,
      name: "",
      email: "",
    };

    this.timeoutRef = setTimeout(function () {
      /* snip */
    }, 1);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  onChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: e.target.value,
      isupdated: false,
    });
  }

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      email: e.target.value,
      isupdated: false,
    });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    clearTimeout(this.timeoutRef);
    this.setState({ issending: true });
    this.timeoutRef = setTimeout(() => {
      const user = {
        name: this.state.name,
        email: this.state.email,
        _id: this.state._id,
      };
      axios
        .post(process.env.REACT_APP_HOST_URL + "users/updateUser", user)
        .then((res) => {
          console.log(res.data);
          window.location.href = this.state.redirect;
        })
        .catch((e) => console.error(e));
      this.setState({ issending: false, isupdated: true });
    }, 500);
  }

  getUserInfo(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/userbyId/" + this.state._id)
      .then((response) => {
        this.setState({ name: response.data.name, email: response.data.email, isloading: false });
        console.log("fetched user info on editUser: " + response.data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render(): JSX.Element {
    if (this.state.isloading) {
      return <Loader active />;
    }

    return (
      <div>
        <div className="component">
          <Header as="h2">
            <Icon name="user" />
            <Header.Content>Edit User Details</Header.Content>
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

import React from "react";

import { Form, Button, Header, Icon, Loader } from "semantic-ui-react";

import axios from "axios";

interface ThisState {
  isloading: boolean;
  issending: boolean;
  isupdated: boolean;
  _id: string;
  password1: string;
  password2: string;
  oldPassword: string;
}

export default class ChangePasswordForm extends React.Component<Record<string, any>, ThisState> {
  timeoutRef: ReturnType<typeof setTimeout>;
  constructor(props: Record<string, never>) {
    super(props);
    this.onChangePassword1 = this.onChangePassword1.bind(this);
    this.onChangePassword2 = this.onChangePassword2.bind(this);
    this.onChangeOldPassword = this.onChangeOldPassword.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isloading: true,
      issending: false,
      isupdated: false,
      _id: this.props._id,

      password1: "",
      password2: "",
      oldPassword: "",
    };

    this.timeoutRef = setTimeout(function () {
      /* snip */
    }, 1);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  onChangePassword1(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      //target is the textbox that user put input and value is the value of the textbox
      password1: e.target.value,
    });
  }
  onChangePassword2(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      //target is the textbox that user put input and value is the value of the textbox
      password2: e.target.value,
    });
  }
  onChangeOldPassword(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      //target is the textbox that user put input and value is the value of the textbox
      oldPassword: e.target.value,
    });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    clearTimeout(this.timeoutRef);
    this.setState({ issending: true });
    this.timeoutRef = setTimeout(() => {
      const user = {
        _id: this.state._id,
        oldPassword: this.state.oldPassword,
        newPassword: this.state.password1,
      };
      //Check if user put password and confirm password and check if two passwords match or not
      if (this.state.password1 !== this.state.password2) {
        alert("Password does not match");
        this.setState({ issending: false, isupdated: false, password1: "", password2: "" });
      } else if (
        !/[a-zA-Z]/g.test(this.state.password1) ||
        !(/\W+/g.test(this.state.password1) || /\d+/g.test(this.state.password1)) ||
        this.state.password1.length < 6
      ) {
        alert(
          "Password not strong enough. Password should be at least 6 characters, and contain at least one non alphabet character. "
        );
        this.setState({ issending: false, isupdated: false, password1: "", password2: "" });
      } else {
        axios
          .post(process.env.REACT_APP_HOST_URL + "users/updatePassword", user)
          .then((res) => {
            console.log(res.data);
            window.location.href = "/profile";
          })
          .catch((e) => console.error(e));
        this.setState({ issending: false, isupdated: true, password1: "", password2: "" });
      }
    }, 500);
  }

  getUserInfo(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/userbyId/" + this.state._id)
      .then((response) => {
        this.setState({ isloading: false });
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
            <Header.Content>Change Password</Header.Content>
          </Header>
          <br />

          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <Form.Input
                icon="user"
                iconPosition="left"
                type="password"
                label="Old Password"
                placeholder="OldPassword"
                className="form-input-control"
                onChange={this.onChangeOldPassword}
                value={this.state.oldPassword}
              />{" "}
              <br />
              <Form.Input
                icon="user"
                iconPosition="left"
                type="password"
                label="New Password"
                placeholder="New Password"
                onChange={this.onChangePassword1}
                value={this.state.password1}
              />
              <br />
              <Form.Input
                icon="user"
                iconPosition="left"
                type="password"
                label="Password Confirmation"
                placeholder="confirm your Password"
                onChange={this.onChangePassword2}
                value={this.state.password2}
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

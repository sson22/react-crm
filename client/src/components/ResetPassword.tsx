import React from "react";
import axios from "axios";
import background from "../assets/background.svg";
import ResetPasswordCSS from "./ResetPassword.module.css";
import { Container, Button, Form, Grid, Segment, Image } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";

interface RouteInfo {
  userId: string;
  token: string;
}

interface ComponentProps extends RouteComponentProps<RouteInfo> {
  userId: string;
  token: string;
}

interface ResetPasswordState {
  password1: string;
  password2: string;
}
/**
 * Once users get the link to reset the password,
 * This class allows users to reset the password and update it on db
 */
export default class ResetPassword extends React.Component<ComponentProps, ResetPasswordState> {
  static readonly path = "/reset-password/:userId/:token";
  constructor(props: ComponentProps) {
    super(props);

    this.onChangePassword1 = this.onChangePassword1.bind(this);
    this.onChangePassword2 = this.onChangePassword2.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      password1: "",
      password2: "",
    };
  }
  //Update password if input value is changed
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
  //Submit new password to db to change user password information
  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log(
      this.state.password1,
      this.state.password2,
      this.props.match.params.userId,
      this.props.match.params.token
    );
    const url =
      process.env.REACT_APP_HOST_URL +
      "users/reset-password/" +
      this.props.match.params.userId +
      "/" +
      this.props.match.params.token;

    // Check if user put password and confirm password and check if two passwords match or not
    if (this.state.password1 !== this.state.password2) {
      alert("Password does not match");
    }
    // Check if the password is length over 6, and has atleast one letter and non-letter
    else if (
      !/[a-zA-Z]/g.test(this.state.password1) ||
      !(/\W+/g.test(this.state.password1) || /\d+/g.test(this.state.password1)) ||
      this.state.password1.length < 6
    ) {
      alert(
        "Password not string enough. Password should be at least 6 characters, and contain at least one non alphabet character. "
      );
    }

    // If password is legitimate, change password
    else {
      const body = { password: this.state.password1 };
      axios
        .post(url, body, { withCredentials: true })
        .then((res) => {
          console.log(res.data);
          window.location.href = "/";
        })
        .catch((e) => console.error(e));
      // Reset the form to be blank.
      this.setState({
        password1: "",
        password2: "",
      });
    }
  }

  render(): JSX.Element {
    return (
      <div>
        <Container>
          <Segment className={ResetPasswordCSS.verticalCenter}>
            <Grid columns={2} stackable className={ResetPasswordCSS.segmentStyle}>
              <Grid.Column className={ResetPasswordCSS.white}>
                <Form onSubmit={this.onSubmit} className={ResetPasswordCSS.formContainer}>
                  <p className={ResetPasswordCSS.welcomeText}>Reset Password</p>
                  <p className={ResetPasswordCSS.infoText}>Please enter your new password below.</p>
                  <Form.Input
                    className={ResetPasswordCSS.inputForm}
                    icon="user"
                    iconPosition="left"
                    label="New Password"
                    type="password"
                    placeholder="New Password"
                    onChange={this.onChangePassword1}
                    value={this.state.password1}
                  />
                  <Form.Input
                    className={ResetPasswordCSS.inputForm}
                    icon="user"
                    iconPosition="left"
                    type="password"
                    label="Password Confirmation"
                    placeholder="confirm your Password"
                    onChange={this.onChangePassword2}
                    value={this.state.password2}
                  />
                  <Button type="submit" className={ResetPasswordCSS.loginButton} content="Reset Password" primary />
                </Form>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Image src={background} />
              </Grid.Column>
            </Grid>
          </Segment>
        </Container>
      </div>
    );
  }
}

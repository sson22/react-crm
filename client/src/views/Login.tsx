import React from "react";
import "dotenv/config";
import axios from "axios";
import background from "../assets/background.svg";
import LoginCSS from "./Login.module.css";
import { Button, Form, Grid, Segment, Image, Container } from "semantic-ui-react";

interface LoginState {
  email: string;
  password: string;
}

export default class Login extends React.Component<Record<string, never>, LoginState> {
  static readonly path = "/login";
  static readonly title = "AppleCRM - Login";
  constructor(props: Record<string, never>) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
    };
  }

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      //target is the textbox that user put input and value is the value of the textbox
      email: e.target.value,
    });
  }
  onChangePassword(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      password: e.target.value,
    });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const url = process.env.REACT_APP_HOST_URL + "users/login/";
    const body = { email: this.state.email, password: this.state.password };

    console.log("body: " + body);
    console.log("url: " + url);

    console.log("ye: " + process.env.ye);
    console.log("REACT_APP_HOST_URL: " + process.env.REACT_APP_HOST_URL);

    axios
      .post(url, body, { withCredentials: true })
      .then((res) => {
        window.location.href = "/";
      })
      .catch((e) => console.error(e));

    // Reset the form to be blank.
    this.setState({
      email: "",
      password: "",
    });
  }

  render(): JSX.Element {
    return (
      <div>
        <title>{Login.title}</title>
        <Container>
          <Segment className={LoginCSS.verticalCenter}>
            <Grid columns={2} stackable className={LoginCSS.segmentStyle}>
              <Grid.Column className={LoginCSS.white}>
                <Form onSubmit={this.onSubmit} className={LoginCSS.formContainer}>
                  <p className={LoginCSS.welcomeText}>Welcome to AppleCRM</p>
                  <p className={LoginCSS.infoText}>Sign in by entering the information below.</p>
                  <Form.Input
                    className={LoginCSS.inputForm}
                    icon="user"
                    iconPosition="left"
                    label="Email Address"
                    placeholder="Email Address"
                    onChange={this.onChangeEmail}
                    value={this.state.email}
                  />
                  <Form.Input
                    className={LoginCSS.inputForm}
                    icon="lock"
                    iconPosition="left"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChangePassword}
                    value={this.state.password}
                  />
                  <p className={LoginCSS.forgotText}>
                    <a href="/forgot-password">Forgot password?</a>
                  </p>
                  <Button type="submit" className={LoginCSS.loginButton} content="Log In" primary />
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

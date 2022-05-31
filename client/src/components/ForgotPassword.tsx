import React from "react";
import axios from "axios";
import background from "../assets/background.svg";
import ForgotPasswordCSS from "./ForgotPassword.module.css";
import { Container, Button, Form, Grid, Segment, Image } from "semantic-ui-react";

interface ForgotPasswordState {
  email: string;
}
/**
 * This class allows users to enter email address to send the link to reset the password
 */
export default class ForgotPassword extends React.Component<Record<string, never>, ForgotPasswordState> {
  static readonly path = "/forgot-password";
  constructor(props: Record<string, never>) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      email: "",
    };
  }
  //Update email when the input value is changed
  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      email: e.target.value,
    });
  }
  //Submit email address to get the reset link via email
  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const url = process.env.REACT_APP_HOST_URL + "users/reset-password";
    const body = { email: this.state.email };
    axios
      .post(url, body, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        //When submit the email, go back to login page
        window.location.href = "/login";
      })
      .catch((e) => console.error(e));

    // Reset the form to be blank.
    this.setState({
      email: "",
    });
  }

  render(): JSX.Element {
    return (
      <div>
        <Container>
          <Segment className={ForgotPasswordCSS.verticalCenter}>
            <Grid columns={2} stackable className={ForgotPasswordCSS.segmentStyle}>
              <Grid.Column className={ForgotPasswordCSS.white}>
                <Form onSubmit={this.onSubmit} className={ForgotPasswordCSS.formContainer}>
                  <p className={ForgotPasswordCSS.welcomeText}>Forgot Password</p>
                  <p className={ForgotPasswordCSS.infoText}>Please enter your email information below.</p>
                  <Form.Input
                    className={ForgotPasswordCSS.inputForm}
                    icon="user"
                    iconPosition="left"
                    label="Email Address"
                    placeholder="Email Address"
                    onChange={this.onChangeEmail}
                    value={this.state.email}
                  />

                  <Button type="submit" className={ForgotPasswordCSS.loginButton} content="Reset Password" primary />
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

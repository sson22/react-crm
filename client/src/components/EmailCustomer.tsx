import axios from "axios";
import React from "react";
import { Header, Icon, Divider, Button, Form, Breadcrumb } from "semantic-ui-react";
import CustomerListCSS from "./CustomerList.module.css";

interface EmailCustomerState {
  id: string;
  subject: string;
  text: string;
  email: string;
}

/* Email Customer page (not a component) */
export default class EmailCustomer extends React.Component<any, EmailCustomerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props._id,
      subject: "",
      text: "",
      email: "",
    };

    // Every time these functions are called, they are variable is set to the new value
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getCustomerInfo();
  }

  // Get customer email information and set it to the state variables
  getCustomerInfo(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "customer/find-one/" + this.state.id)
      .then((response) => {
        this.setState({
          email: response.data.email,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Update when the input value change
  onChangeSubject(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      subject: e.target.value,
    });
  }

  onChangeText(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({
      text: e.target.value,
    });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    const body = { email: this.state.email, subject: this.state.subject, text: this.state.text, custId: this.state.id };
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_HOST_URL + "users/email-customer", body, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        window.location.href = "/customerList";
      })
      .catch((e) => console.error(e));
    this.setState({
      subject: "",
      text: "",
    });
  }

  sections = [
    { key: "Customer List", content: "Customer List", link: true, href: "/customerList" },
    { key: "View Customer", content: "View Customer", link: true, href: "/customerList/page/" + this.props._id },
    { key: "Email", content: "Email", active: false },
  ];

  render(): JSX.Element {
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
                <Header.Content> Email Customer </Header.Content>
                <br />
              </Header>
            </div>
          </div>
          <Divider />
          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <label>To </label>
              <input type="text" disabled className="form-control" value={this.state.email} />
              <br />
              <label>Subject </label>
              <input
                type="text"
                placeholder="Subject"
                required
                className="form-control"
                value={this.state.subject}
                onChange={this.onChangeSubject}
              />
            </Form.Field>
            <label className={CustomerListCSS.textArea}>Content</label>
            <Form.TextArea
              type="text"
              placeholder="Content"
              required
              value={this.state.text}
              onChange={this.onChangeText}
            />
            <div>
              <br />
              <Button color="blue" type="submit">
                <p>Send Email</p>
              </Button>
            </div>
          </Form>
          <br />
        </div>
      </div>
    );
  }
}

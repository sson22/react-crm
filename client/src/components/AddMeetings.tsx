import React from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Container, Form } from "semantic-ui-react";
import Select from "react-select";
import { getLoggedUserInfo } from "../context/Session";
import CalendarCSS from "./Calendar.module.css";
interface ShowProps {
  show: boolean;
  hideModal: any;
}
interface ShowState {
  creatorId: string;
  users: [any?];
  customers: [any?];
  selectedCusts: [string];
  selectedUsers: [string];
  title: string;
  location: string;
  link: string;
  start: Date;
  end: Date;
  adding: boolean;
}
/**
 * This class creates meetings using Modals,
 * change selected user names and customer names to user ids and customer names
 * before pass the information to the backend
 */
export default class AddMeetings extends React.Component<ShowProps, ShowState> {
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      customers: [],
      creatorId: "",
      selectedCusts: [""],
      selectedUsers: [""],
      title: "",
      location: "",
      link: "",
      start: new Date(),
      end: new Date(),
      adding: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.getAllCustomers = this.getAllCustomers.bind(this);
    this.onSelectedCustIds = this.onSelectedCustIds.bind(this);
    this.onSelectedUserIds = this.onSelectedUserIds.bind(this);
  }

  //Fetch all information needed for select options when creating a meeting
  componentDidMount() {
    // fetch customer ids after mount
    this.getAllCustomers();
    this.getAllUsers();
    this.getUserInfo();
  }

  //Fetch current user information needed for a creatorId on the meeting
  getUserInfo(): void {
    getLoggedUserInfo()
      .then((val: string) => this.setState({ creatorId: val }))
      .catch((e: any) => {
        console.log(e);
      });
  }

  //Fetch all customer information to display for select options
  getAllCustomers(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "customer/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            customers: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Fetch all user information to display to select for the meeting
  getAllUsers(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Set state when there is a change
  onChangeStart(date: Date): void {
    this.setState({
      start: date,
    });
  }

  onChangeEnd(date: Date): void {
    this.setState({
      end: date,
    });
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeLocation(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      location: e.target.value,
    });
  }

  onChangeLink(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      link: e.target.value,
    });
  }

  //Transform selected customer information to user id before sending it to db
  onSelectedCustIds(selected: any) {
    this.setState({
      selectedCusts: selected.map((selected: any) => selected.value),
    });
  }

  //Transform selected user information to user id before sending it to db
  onSelectedUserIds(selected: any) {
    this.setState({
      selectedUsers: selected.map((selected: any) => selected.value),
    });
  }
  //Alert user if start date is already passed or end date is smaller(earlier) than start date
  validateDates() {
    if (this.state.start >= this.state.end) {
      return alert("Date range is not valid");
    }
    if (this.state.start < new Date()) {
      return alert("Start date has passed");
    }
    return true;
  }
  //Send all information to the db
  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const url = process.env.REACT_APP_HOST_URL + "meetings/create";
    if (!this.validateDates()) {
      return;
    }
    //Avoid creating duplicate meetings by clicking multiple times
    this.setState({
      adding: true,
    });
    const body = {
      title: this.state.title,
      location: this.state.location,
      link: this.state.link,
      start: this.state.start,
      end: this.state.end,
      creatorId: this.state.creatorId,
      custIds: this.state.selectedCusts,
      userIds: this.state.selectedUsers,
    };
    axios
      .post(url, body, { withCredentials: true })
      .then((res) => {
        console.log("Front end print onSubmit: ");
        console.log(res.data);
        window.location.href = "/calendar";
      })
      .catch((e) => console.error(e))
      .finally(() => {
        this.setState({
          adding: false,
        });
      });
  }

  render(): JSX.Element {
    const { show, hideModal } = this.props;
    if (!show) {
      return <></>;
    } else {
      return (
        <div className={CalendarCSS.overlay}>
          <div className={CalendarCSS.modalContainer}>
            <Form onSubmit={this.onSubmit}>
              <Form.Input
                className={CalendarCSS.inputForm}
                label="Meeting Title"
                placeholder="Meeting Title"
                onChange={this.onChangeTitle}
                value={this.state.title}
              />
              <Form.Input
                lassName={CalendarCSS.inputForm}
                label="Meeting Location"
                placeholder="Meeting Location"
                onChange={this.onChangeLocation}
                value={this.state.location}
              />
              <Form.Input
                lassName={CalendarCSS.inputForm}
                label="Meeting Link"
                placeholder="Meeting Link"
                onChange={this.onChangeLink}
                value={this.state.link}
              />
              <label className={CalendarCSS.labelTop}>Customers</label>
              <Select
                isMulti
                options={this.state.customers.map((customer) => ({ value: customer._id, label: customer.name }))}
                onChange={this.onSelectedCustIds}
              />
              <label className={CalendarCSS.label}>Users</label>
              <Select
                isMulti
                options={this.state.users.map((user) => ({ value: user._id, label: user.name }))}
                onChange={this.onSelectedUserIds}
              />
              <label className={CalendarCSS.label}>Start Date</label>
              <DatePicker
                selected={this.state.start}
                onChange={this.onChangeStart}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="dd/MM/yyyy h:mm aa"
              />
              <br />
              <label className={CalendarCSS.label}>End Date</label>
              <DatePicker
                selected={this.state.end}
                onChange={this.onChangeEnd}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="dd/MM/yyyy h:mm aa"
              />
              <div className={CalendarCSS.newButtonTop}>
                <Button className={CalendarCSS.newButtonTop} color="blue" type="submit" disabled={this.state.adding}>
                  Submit
                </Button>
              </div>
              <div className={CalendarCSS.newButton}>
                <Button onClick={hideModal} className={CalendarCSS.newButton}>
                  Close
                </Button>
              </div>
            </Form>
          </div>
        </div>
      );
    }
  }
}

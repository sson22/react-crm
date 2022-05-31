import React from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form } from "semantic-ui-react";
import Select from "react-select";
import { getLoggedUserInfo } from "../context/Session";
import CalendarCSS from "./Calendar.module.css";
interface ShowProps {
  show: boolean;
  hideModal: any;
  id: any;
}

interface ShowState {
  creatorId: string;
  users: [any?];
  customers: [any?];
  title: string;
  location: string;
  custIds: string[];
  userIds: string[];
  custNames: [any?];
  userNames: [any?];
  link: string;
  start: Date;
  end: Date;
  editModal: boolean;
  adding: boolean;
}

/**
 * This class fetches all the information of selected meeting from db,
 * display it on edit page, provides editing functionality.
 */
export default class EditMeetings extends React.Component<ShowProps, ShowState> {
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      customers: [],
      creatorId: "",
      custNames: [""],
      userNames: [""],
      userIds: [""],
      custIds: [""],
      title: "",
      location: "",
      link: "",
      start: new Date(),
      end: new Date(),
      editModal: false,
      adding: false,
    };

    // Every time these functions are called, they are variable is set to the new value
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

  //Fetch all information needed to display the meeting information and
  //options to choose for editing
  componentDidMount() {
    // fetch customer ids after mount
    this.getAllCustomers();
    this.getAllUsers();
    this.getUserInfo();
    this.getOneMeeting();
  }
  //Update props passed from parent class when there is any change
  componentWillReceiveProps() {
    this.getOneMeeting();
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
  //Fetch all user information to display for select options
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
  //Fetch selected meeting information
  async getOneMeeting() {
    //Return null when there is no props (When you load the page)
    if (!this.props.id) return;
    axios
      .get(process.env.REACT_APP_HOST_URL + "meetings/find-one/" + this.props.id)
      .then((response) => {
        const { link, title, location, start, end, custIds, userIds } = response.data;

        this.setState({
          link,
          title,
          location,
          start: new Date(start),
          end: new Date(end),
          custIds,
          userIds,
        });
        //Change fetched customer id and user id to customer name and user name to display
        this.changeCustIdsToNames(custIds);
        this.changeUserIdsToNames(userIds);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //Convert customer ids of the selected meeting to customer names
  async changeCustIdsToNames(custIds: any) {
    const body = { custIds };
    const url = process.env.REACT_APP_HOST_URL + "customer/custs-by-ids/";
    axios.post(url, body).then((response) => {
      this.setState({ custNames: response.data });
    });
  }
  //Convert user ids of the selected meeting to customer names
  async changeUserIdsToNames(userIds: any) {
    const body = { userIds };
    const url = process.env.REACT_APP_HOST_URL + "users/usersByIds/";
    axios.post(url, body).then((response) => {
      this.setState({ userNames: response.data });
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
  async onSelectedCustIds(selected: any) {
    this.setState({
      custNames: selected.map((selected: any) => selected),
      custIds: selected.map((selected: any) => selected.value),
    });
  }
  //Transform selected user information to user id before sending it to db
  async onSelectedUserIds(selected: any) {
    console.log(selected);
    this.setState({
      userIds: selected.map((selected: any) => selected.value),
      userNames: selected.map((selected: any) => selected),
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
    const url = process.env.REACT_APP_HOST_URL + "meetings/update";
    if (!this.validateDates()) {
      return;
    }
    //Avoid creating duplicate meetings by clicking multiple times
    this.setState({
      adding: true,
    });
    const body = {
      _id: this.props.id,
      title: this.state.title,
      location: this.state.location,
      link: this.state.link,
      start: this.state.start,
      end: this.state.end,
      creatorId: this.state.creatorId,
      custIds: this.state.custIds,
      userIds: this.state.userIds,
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
                className={CalendarCSS.inputForm}
                label="Meeting Location"
                placeholder="Meeting Location"
                onChange={this.onChangeLocation}
                value={this.state.location}
              />
              <Form.Input
                className={CalendarCSS.inputForm}
                label="Meeting Link"
                placeholder="Meeting Link"
                onChange={this.onChangeLink}
                value={this.state.link}
              />
              <label className={CalendarCSS.lableTop}>Customers</label>
              <Select
                isMulti
                value={this.state.custNames.map((customer) => ({ value: customer._id, label: customer.name }))}
                options={this.state.customers.map((customer) => ({ value: customer._id, label: customer.name }))}
                onChange={this.onSelectedCustIds}
              />
              <label className={CalendarCSS.label}>Users</label>
              <Select
                isMulti
                options={this.state.users.map((user) => ({ value: user._id, label: user.name }))}
                onChange={this.onSelectedUserIds}
                value={this.state.userNames.map((user) => ({ value: user._id, label: user.name }))}
              />
              <label className={CalendarCSS.label}>Start Date</label>
              <DatePicker
                selected={this.state.start}
                onChange={this.onChangeStart}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="dd/MM/yyyy h:mm aa"
              />{" "}
              <br />
              <label className={CalendarCSS.label}>End Date</label>
              <DatePicker
                selected={this.state.end}
                onChange={this.onChangeEnd}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="dd/MM/yyyy h:mm aa"
              />{" "}
              <br />
              <div className={CalendarCSS.buttonParent}>
                <div className={CalendarCSS.newButton}>
                  <Button className={CalendarCSS.newButton} color="blue" type="submit">
                    Submit
                  </Button>
                </div>
                <div className={CalendarCSS.newButton}>
                  <Button className={CalendarCSS.newButton} onClick={hideModal}>
                    Close
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      );
    }
  }
}

import React from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "semantic-ui-react";
import EditMeetings from "./EditMeetings";
import CalendarCSS from "./Calendar.module.css";
interface ShowProps {
  show: boolean;
  hideModal: any;
  id: any;
}

interface ShowState {
  title: string;
  location: string;
  link: string;
  start: string;
  custIds: string[];
  userIds: string[];
  custNames: string[];
  userNames: string[];
  end: string;
  editModal: boolean;
}

/**
 * This class shows selected meeting information using Modals and
 * gives an option to edit or delete the meeting
 */

export default class ViewMeetings extends React.Component<ShowProps, ShowState> {
  constructor(props: any) {
    super(props);

    this.state = {
      userIds: [],
      custNames: [],
      userNames: [],
      custIds: [""],
      title: "",
      location: "",
      link: "",
      start: "",
      end: "",
      editModal: false,
    };
    this.deleteMeeting = this.deleteMeeting.bind(this);
  }

  //Update props passed from parent class when there is a change
  componentWillReceiveProps() {
    this.getOneMeeting();
  }

  //Fetch all information needed to display the meeting
  componentDidMount() {
    this.getOneMeeting();
  }

  //Open Modal window
  showEditModal = () => {
    this.setState({ editModal: true });
  };

  //Close Modal window
  hideEditModal = () => {
    this.setState({ editModal: false });
    this.props.hideModal();
  };

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
          start: new Date(start).toString().slice(0, 24),
          end: new Date(end).toString().slice(0, 24),
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

  //Delete selected meeting
  deleteMeeting() {
    const body = { _id: this.props.id };
    const url = process.env.REACT_APP_HOST_URL + "meetings/delete/";
    axios.post(url, body).then(() => {
      window.location.href = "/calendar";
    });
  }
  //Convert customer ids of the selected meeting to customer names
  async changeCustIdsToNames(custIds: any) {
    const body = { custIds };
    const url = process.env.REACT_APP_HOST_URL + "customer/convert-cust-id";
    axios.post(url, body).then((response) => {
      this.setState({ custNames: response.data });
    });
  }
  //Convert user ids of the selected meeting to user names
  async changeUserIdsToNames(userIds: any) {
    const body = { userIds };
    const url = process.env.REACT_APP_HOST_URL + "users/convert-user-id";
    axios.post(url, body).then((response) => {
      this.setState({ userNames: response.data });
    });
  }

  render(): JSX.Element {
    //Call props passed from parent class
    const { show, hideModal } = this.props;
    //Modal state is no, return null
    if (!show) {
      return <></>;
      //When Edit is clicked, render Edit Modal and hide View Modal
    } else if (this.state.editModal) {
      return <EditMeetings show={this.state.editModal} hideModal={this.hideEditModal} id={this.props.id} />;
    } else {
      //Render View Modal
      return (
        <div className={CalendarCSS.overlay}>
          <div className={CalendarCSS.modalContainerView}>
            <label className={CalendarCSS.labelView}>Meeting Title</label>
            <p>{this.state.title}</p>
            <label className={CalendarCSS.labelView}>Meeting Location</label>
            <p>{this.state.location}</p>
            <label className={CalendarCSS.labelView}>Meeting Link</label>
            <p>{this.state.link}</p>
            <label className={CalendarCSS.labelView}>Customers</label>
            <ul>
              {this.state.custNames.map((customer) => (
                <li key={customer}>{customer}</li>
              ))}
            </ul>
            <label className={CalendarCSS.labelView}>Users</label>
            <ul>
              {this.state.userNames.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
            <label className={CalendarCSS.labelView}>Start Time </label>
            <p>{this.state.start}</p>
            <label className={CalendarCSS.labelView}>End Time </label>
            <p>{this.state.end}</p>
            <div className={CalendarCSS.newButtonViewTop}>
              <Button className={CalendarCSS.newButtonViewTop} onClick={this.showEditModal} color="blue" type="submit">
                Edit Event
              </Button>
            </div>
            <div className={CalendarCSS.newButtonView}>
              <Button className={CalendarCSS.newButtonView} color="black" onClick={() => this.deleteMeeting()}>
                Delete Event
              </Button>
            </div>
            <div className={CalendarCSS.newButtonView}>
              <Button className={CalendarCSS.newButtonView} onClick={hideModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }
}

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import AddMeetings from "./AddMeetings";
import ViewMeetings from "./ViewMeetings";
import { Button, Header, Icon } from "semantic-ui-react";
import axios from "axios";
import CalendarCSS from "./Calendar.module.css";

interface IMeeting {
  meetingId: string;
  custIds: [string];
  creatorId: string;
  userIds: [string];
  title: string;
  location: string;
  link: string;
  start: Date;
  end: Date;
}

interface ICalendarState {
  events: IMeeting[];
  userId: string;
  selectedMeetingId: string;
  addModal: boolean;
  viewModal: boolean;
}

/* Calendar Content page which deals with add, edit and delete functions */
export default class CalendarContent extends React.Component<Record<string, any>, ICalendarState> {
  static readonly path = "/calendar";
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { events: [], userId: "", addModal: false, selectedMeetingId: "", viewModal: false };
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getAllMeeting = this.getAllMeeting.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  // Open Add Meeting Modal
  showAddModal = () => {
    this.setState({ addModal: true });
  };

  // Close Add Meeting Modal
  hideAddModal = () => {
    this.setState({ addModal: false });
  };

  // Open Edit Meetin Modal
  showViewModal = () => {
    this.setState({ viewModal: true });
  };

  // Hide Edit Meeting Modal
  hideViewModal = () => {
    this.setState({ viewModal: false });
  };

  // Shows Event delails when click the event
  handleEventClick = (e: any) => {
    this.setState({ selectedMeetingId: e.event._def.extendedProps._id });
    this.showViewModal();
  };

  // Get user info to pass to db with meeting details
  getUserInfo(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "users/user-info", { withCredentials: true })
      .then((response) => {
        this.setState({ userId: response.data._id });
        this.getAllMeeting();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Fetch all meeting lists and display on the default calendar page
  getAllMeeting(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "meetings/find-account/" + this.state.userId, { withCredentials: true })
      .then((response) => {
        this.setState({ events: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render(): JSX.Element {
    return (
      <div>
        <div className={CalendarCSS.flexContainer}>
          <div>
            <Header as="h2">
              <Icon name="calendar alternate" />
              <Header.Content>Calendar</Header.Content>
            </Header>
          </div>
          <AddMeetings show={this.state.addModal} hideModal={this.hideAddModal} />
          <ViewMeetings show={this.state.viewModal} id={this.state.selectedMeetingId} hideModal={this.hideViewModal} />
          <Button color="blue" onClick={this.showAddModal}>
            Add Meeting
          </Button>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          events={this.state.events}
          timeZone="local"
          eventClick={this.handleEventClick}
        />
      </div>
    );
  }
}

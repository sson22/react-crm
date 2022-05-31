import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

interface IDayCalenderState {
  events: IMeeting[];
}

interface IDayCalenderProps {
  _id: string;
}

interface IMeeting {
  meetingId: string;
  title: string;
  location: string;
  link: string;
  start: Date;
  end: Date;
}
export default class DayCalender extends React.Component<IDayCalenderProps, IDayCalenderState> {
  constructor(props: any) {
    super(props);
    this.state = { events: [] };
  }
  componentDidMount() {
    this.getMeetings();
  }
  getMeetings(): void {
    axios
      .get(process.env.REACT_APP_HOST_URL + "meetings/find-account/" + this.props._id)
      .then((response: any) => {
        //In this case you do want to fetch all the data.
        this.setState({ events: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render(): JSX.Element {
    return (
      <div>
        <FullCalendar plugins={[listPlugin]} initialView="listWeek" events={this.state.events} />
      </div>
    );
  }
}

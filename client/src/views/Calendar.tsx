import React from "react";
import CalendarContent from "../components/CalendarContent";

export default class Calendar extends React.Component {
  static readonly path = "/calendar";
  static readonly title = "AppleCRM - Calendar";

  render(): JSX.Element {
    return (
      <div className="component">
        <title>{Calendar.title}</title>
        <CalendarContent location={Calendar.path} />
      </div>
    );
  }
}

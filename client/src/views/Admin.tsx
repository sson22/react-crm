import React from "react";
import UserList from "../components/UserList";

export default class Admin extends React.Component {
  static readonly path = "/admin";
  static readonly title = "AppleCRM - Admin";

  render(): JSX.Element {
    return (
      <div>
        <title>{Admin.title}</title>
        <UserList location={Admin.path} />
      </div>
    );
  }
}

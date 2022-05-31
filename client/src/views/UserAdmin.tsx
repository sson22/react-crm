import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";
import UserPage from "../components/UserPage";

/* Base for the User Information Page for admins, similar to CustomerPageBase */
export default class UserAdmin extends React.Component<any, any> {
  static readonly path = "/admin/page/:id";
  static readonly title = "AppleCRM - admin/page";
  static readonly heading = "View User";
  constructor(props: any) {
    super(props);
    // console.log(props);
  }
  sections = [
    { key: "User List", content: "User List", link: true, href: "/admin" },
    { key: "View user", content: "View User", active: false },
  ];
  render(): JSX.Element {
    return (
      <div>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>
        <title>{UserAdmin.title}</title>
        <UserPage
          _id={this.props.match.params.id}
          location={this.props.location.pathname}
          pageTitle={UserAdmin.heading}
        />
      </div>
    );
  }
}

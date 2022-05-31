import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";
import EditUserForm from "../components/EditUserForm";

/**
 * View which renders the EditUserForm used in the Admin User List
 * This page is called in App.tsx
 */
export default class EditUserAdmin extends React.Component<any, never> {
  static readonly path = "/admin/page/:id/edit/";
  static readonly redirect = "/admin/page/";
  static readonly title = "AppleCRM - admin/page/edit";
  constructor(props: any) {
    super(props);
  }

  sections = [
    { key: "User List", content: "User List", link: true, href: "/admin" },
    { key: "View User", content: "View User", link: true, href: "/admin/page/" + this.props.match.params.id },
    { key: "Edit", content: "Edit", active: false },
  ];

  render(): JSX.Element {
    return (
      <div>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>
        <title>{EditUserAdmin.title}</title>
        <EditUserForm redirect={EditUserAdmin.redirect + this.props.match.params.id} _id={this.props.match.params.id} />
      </div>
    );
  }
}

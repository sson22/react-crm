import React from "react";
import { Breadcrumb, Divider, Loader } from "semantic-ui-react";
import EditUserForm from "../components/EditUserForm";
import { getLoggedUserInfo } from "../context/Session";

interface IEditProfileState {
  isloading: boolean;
  _id: string;
}

/**
 * View which renders the EditUserForm used in the Profile Page
 * This page is called in App.tsx
 */
export default class EditProfile extends React.Component<any, IEditProfileState> {
  static readonly path = "/profile/edit/";
  static readonly redirect = "/profile";
  static readonly title = "AppleCRM - profile/edit";
  constructor(props: any) {
    super(props);
    this.state = { isloading: true, _id: "" };
    console.log(this.props);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.setState({ isloading: true });
    getLoggedUserInfo()
      .then((user: any) => this.setState({ isloading: false, _id: user._id }))
      .catch((e: any) => {
        console.log(e);
      });
  }

  sections = [
    { key: "Profile", content: "Profile", link: true, href: "/profile" },
    { key: "Edit", content: "Edit", active: false },
  ];

  render(): JSX.Element {
    if (this.state.isloading) {
      return <Loader active />;
    }
    return (
      <div>
        <title>{EditProfile.title}</title>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>
        <EditUserForm location={EditProfile.path} redirect={EditProfile.redirect} _id={this.state._id} />
      </div>
    );
  }
}

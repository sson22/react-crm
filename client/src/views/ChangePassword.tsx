import React from "react";
import { Breadcrumb, Divider, Loader } from "semantic-ui-react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { getLoggedUserInfo } from "../context/Session";

interface IChangePasswordState {
  isloading: boolean;
  _id: string;
}
export default class ChangePassword extends React.Component<any, IChangePasswordState> {
  static readonly path = "/profile/change-password/";
  static readonly title = "AppleCRM - profile/change password";
  constructor(props: any) {
    super(props);
    this.state = { isloading: true, _id: "" };
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
    { key: "Change Password", content: "Change Password", active: false },
  ];

  render(): JSX.Element {
    if (this.state.isloading) {
      return <Loader active />;
    }
    return (
      <div>
        <title>{ChangePassword.title}</title>
        <div>
          <Breadcrumb icon="right angle" sections={this.sections} />
          <Divider />
        </div>
        <ChangePasswordForm location={ChangePassword.path} _id={this.state._id} />
      </div>
    );
  }
}

import React from "react";
import { Loader } from "semantic-ui-react";
import UserPage from "../components/UserPage";
import { getLoggedUserInfo } from "../context/Session";

interface UserState {
  isloading: boolean;
  _id: string;
}
export default class Profile extends React.Component<any, UserState> {
  static readonly path = "/profile";
  static readonly title = "AppleCRM - profile";
  constructor(props: any) {
    super(props);
    this.state = { isloading: true, _id: "" };
  }

  // Loads these components before the page renders
  componentDidMount() {
    this.getUserInfo();
  }

  // Fetch logged in user info from the database.
  getUserInfo(): void {
    this.setState({ isloading: true });
    getLoggedUserInfo()
      .then((user: any) => this.setState({ isloading: false, _id: user._id }))
      .catch((e: any) => {
        console.log(e);
      });
  }

  render(): JSX.Element {
    if (this.state.isloading) {
      return <Loader active />;
    }
    return (
      <div>
        <title>{Profile.title}</title>
        <UserPage _id={this.state._id} location={Profile.path} pageTitle="Profile Page" />
      </div>
    );
  }
}

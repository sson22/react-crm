import React from "react";
import { Grid, Loader } from "semantic-ui-react";
import DayCalender from "../components/DayCalender";
import UserCard from "../components/UserCard";
import { getLoggedUserInfo } from "../context/Session";

interface IDashboardState {
  _id: string;
  name: string;
  isloading: boolean;
}
export default class Dashboard extends React.Component<any, IDashboardState> {
  static readonly path = "/dashboard";
  static readonly title = "AppleCRM - dashboard";
  static readonly welcomeMessage = "Welcome to AppleCRM";
  constructor(props: any) {
    super(props);
    this.state = { _id: "", name: "", isloading: true };
  }

  componentDidMount() {
    this.setState({ isloading: true });
    getLoggedUserInfo()
      .then((user: any) => this.setState({ _id: user._id, name: user.name, isloading: false }))
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
        <title> {Dashboard.title} </title>
        <div className="component">
          <Grid verticalAlign="middle" padded>
            <Grid.Row columns={2}>
              <Grid.Column>
                <UserCard _id={this.state._id} name={this.state.name} message={Dashboard.welcomeMessage} />
              </Grid.Column>
              <Grid.Column>
                <DayCalender _id={this.state._id} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

import React from "react";
import CustomerPage from "../components/CustomerPage";

/* Base for the Customer Information Page, similar to UserAdmin */
export default class CustomerPageBase extends React.Component<any, any> {
  static readonly path = "/customerList/page/:id";
  static readonly title = "AppleCRM - customer/page";
  constructor(props: any) {
    super(props);
    // console.log(props);
  }

  render(): JSX.Element {
    return (
      <div>
        <title>{CustomerPageBase.title}</title>
        <CustomerPage
          _id={this.props.match.params.id}
          location={this.props.location.pathname}
          pageTitle="View Customer"
        />
      </div>
    );
  }
}

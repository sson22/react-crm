import React from "react";
import EmailCustomer from "../components/EmailCustomer";

/**
 * View which renders the EmailCustomerPage used in the CustomerList
 * This page is called in App.tsx
 */
export default class EmailCustomerPage extends React.Component<any, never> {
  static readonly path = "/customerList/page/:id/email/";
  static readonly title = "AppleCRM - customer/page/email";
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div>
        <title>{EmailCustomerPage.title}</title>
        <EmailCustomer _id={this.props.match.params.id} />
      </div>
    );
  }
}

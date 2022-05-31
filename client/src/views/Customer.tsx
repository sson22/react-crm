import React from "react";
import CustomerList from "../components/CustomerList";

export default class Customer extends React.Component {
  static readonly path = "/customerList";
  static readonly title = "AppleCRM - Customer";

  render(): JSX.Element {
    return (
      <div className="component">
        <title>{Customer.title}</title>
        <CustomerList location={Customer.path} />
      </div>
    );
  }
}

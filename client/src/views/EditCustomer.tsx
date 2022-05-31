import React from "react";
import EditCustomerForm from "../components/EditCustomerForm";

/**
 * View which renders the EditCustomerForm used in the CustomerList
 * This page is called in App.tsx
 */
export default class EditCustomer extends React.Component<any, never> {
  static readonly path = "/customerList/page/:id/edit/";
  static readonly title = "AppleCRM - customer/page/edit";
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div>
        <title>{EditCustomer.title}</title>
        <EditCustomerForm _id={this.props.match.params.id} />
      </div>
    );
  }
}

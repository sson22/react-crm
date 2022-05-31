import mongoose = require("mongoose");

/* Create an interface representing a document in MongoDB. */
export interface CustomerInterface extends mongoose.Document {
  name: string;
  company: string;
  phone: number;
  email: string;
  favourite: boolean;
  image: string;
}

/* Schema for the customer database */
const customerSchema = new mongoose.Schema<CustomerInterface>(
  {
    custId: String,
    name: { type: String, required: true },
    company: { type: String, required: true },
    phone: Number,
    email: String,
    favourite: { type: Boolean, default: false },
  },
  { collection: "Customers" }
);

const Customer = mongoose.model<CustomerInterface>("Customer", customerSchema);
export { Customer };

import mongoose from "mongoose";
import bcrypt from "bcrypt";

/* Create an interface representing a document in MongoDB. */
export interface UserInterface extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  password: string;
  address: string;
  department: string;
  phone_number: number;
  image: string;
  validPassword(password: string): Promise<boolean>;
  generateHash(password: string): string;
}

export interface UserModel extends mongoose.Model<UserInterface> {
  validPassword(password: string): Promise<boolean>;
  generateHash(password: string): string;
}

/* Schema for the user database */
export const userSchema = new mongoose.Schema<UserInterface>(
  {
    userId: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    address: { type: String },
    department: { type: String },
    phone_number: { type: Number },
    image: { type: mongoose.Schema.Types.ObjectId },
  },
  { collection: "Users" }
);

userSchema.methods.generateHash = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model<UserInterface, UserModel>("User", userSchema);
export { User };

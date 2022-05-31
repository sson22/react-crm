import mongoose from "mongoose";

/* Create an interface representing a document in MongoDB. */
export interface imageInterface extends mongoose.Document {
  name: string;
  img: {
    data: Buffer;
    contentType: string;
  };
}
const imageSchema = new mongoose.Schema<imageInterface>(
  {
    name: { type: String },
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  { collection: "Images" }
);

const Image = mongoose.model<imageInterface>("Image", imageSchema);
export { Image };

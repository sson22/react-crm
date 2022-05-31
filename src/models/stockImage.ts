import mongoose from "mongoose";

/* Create an interface representing a document in MongoDB. */
export interface stockImageInterface extends mongoose.Document {
  name: string;
  img: {
    data: Buffer;
    contentType: string;
  };
}
const stockImageSchema = new mongoose.Schema<stockImageInterface>(
  {
    name: { type: String },
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  { collection: "StockImages" }
);

const StockImage = mongoose.model<stockImageInterface>("StockImage", stockImageSchema);
export { StockImage };

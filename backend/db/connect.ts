import mongoose from "mongoose";

//Todo - move this to .env
export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://koushith:koushith97!@cluster0.mvgle.mongodb.net/?retryWrites=true&w=majority"
    );

    console.log("Connected to Mongo DB", conn.connection.host);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const submittedLinkSchema = new mongoose.Schema({
  callback_id: { type: String, required: true },
  status: { type: String, required: true },
  email: { type: String, required: true },
  template_id: { type: String, required: false },
});

export const SubmittedLink = mongoose.model(
  "SubmittedLink",
  submittedLinkSchema
);

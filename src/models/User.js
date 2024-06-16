import mongoose, { Schema } from "mongoose";

// schema User variables
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";




const userSchema = new mongoose.Schema(
    {
      user_name: {
        type: String,
        unique: true,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
      collection: COLLECTION_NAME,
    }
  );

export default mongoose.model(DOCUMENT_NAME, userSchema);

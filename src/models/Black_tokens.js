import mongoose, { Schema } from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Black_Token";
const COLLECTION_NAME = "Black_Tokens";

const tokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    access_token: {
        type: String,
        required: true
    },
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
})

tokenSchema.index({createdAt: 1}, {expireAfterSeconds: 7*24*60*60});

export default mongoose.model(DOCUMENT_NAME, tokenSchema)
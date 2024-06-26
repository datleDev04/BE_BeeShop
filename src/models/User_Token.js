import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "User_Token";
const COLLECTION_NAME = "User_Tokens";

const userTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    refresh_token: {
        type: String,
        required: true
    },
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
})

export default mongoose.model(DOCUMENT_NAME, userTokenSchema)
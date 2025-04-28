import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
    {
        created: { type: Date, required: true },
        banned: { type: Boolean, default: false },
        ip: { type: String, required: true, unique: true },
        accountId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    {
        collection: "users"
    }
);

const User = mongoose.model('User', UserModel);

export default User;

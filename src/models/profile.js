import mongoose from "mongoose";

const ProfilesSchema = new mongoose.Schema(
    {
        created: { 
            type: Date, 
            required: true 
        },
        accountId: { 
            type: String, 
            required: true, 
            unique: true 
        },
        profiles: { 
            type: Object, 
            required: true 
        }
    },
    {
        collection: "profiles"
    }
);

const Profile = mongoose.model('ProfilesSchema', ProfilesSchema);

export default Profile;

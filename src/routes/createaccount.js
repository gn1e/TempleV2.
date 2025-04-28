import app from "..";
import mongoose from 'mongoose';
import crypto from 'crypto';
import UserModel from "../models/user";
import fs from 'fs';
import bcrypt from 'bcrypt'; 
import Profile from '../models/profile';
import User from '../models/user';
// base skunked from lawin!


export default function () {
    function MakeID(length = 10) {
        return crypto.randomBytes(length).toString('hex');
    }

    function createProfiles(accountId) {
        let profiles = {};
    
        fs.readdirSync("../../Profiles").forEach(fileName => {
            const profile = require(`../../Profiles/${fileName}`);
    
            profile.accountId = accountId;
            profile.created = new Date().toISOString();
            profile.updated = new Date().toISOString();
    
            profiles[profile.profileId] = profile;
        });
    
        return profiles;
    }
    
    async function validateProfile(profileId, profiles) {
        try {
            let profile = profiles[profileId];
    
            if (!profile || !profileId) throw new Error("Invalid profile/profileId");
        } catch (error) {
            console.error(error);
            return false;
        }
    
        return true;
    }
    

    
    app.post('/register', async (c) => {
        try {

            const rawRequestBody = await c.req.text();

            

            if (!rawRequestBody) {
                return c.json({ message: "Request body cannot be empty." }, 400);
            }

            const { ip, username, email: rawEmail, password: plainPassword } = JSON.parse(rawRequestBody);
            

            let email = rawEmail.toLowerCase();

            if (!ip || !username || !email || !plainPassword) {
                return c.json({ message: "Username/email/password is required." }, 400);
            }

            if (await User.findOne({ ip })) {
                return c.json({ message: "You already created an account!" }, 400);
            }
    
            const accountId = MakeID().replace(/-/g, "");
    
            const emailFilter = /^([a-zA-Z0-9._-]+)@(([a-zA-Z0-9-]+)+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!emailFilter.test(email)) {
                return c.json({ message: "You did not provide a valid email address!" }, 400);
            }
    
            if (username.length >= 25) {
                return c.json({ message: "Your username must be less than 25 characters long." }, 400);
            }
            if (username.length < 3) {
                return c.json({ message: "Your username must be at least 3 characters long." }, 400);
            }
    
            if (plainPassword.length >= 128) {
                return c.json({ message: "Your password must be less than 128 characters long." }, 400);
            }
            if (plainPassword.length < 8) {
                return c.json({ message: "Your password must be at least 8 characters long." }, 400);
            }
    
            const allowedCharacters = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").split("");
            for (let character of username) {
                if (!allowedCharacters.includes(character)) {
                    return c.json({ message: "Your username has special characters, please remove them and try again." }, 400);
                }
            }
    
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
            try {
                const newUser = await User.create({
                    created: new Date().toISOString(),
                    ip,
                    accountId,
                    username,
                    username_lower: username.toLowerCase(),
                    email,
                    password: hashedPassword
                });
    
                const profiles = createProfiles(newUser.accountId);
    
                const profileId = Object.keys(profiles)[0];
                const isValidProfile = await validateProfile(profileId, profiles);
    
                if (!isValidProfile) {
                    return c.json({ message: "Invalid profile created.", status: 400 });
                }
    
                await Profile.create({
                    created: newUser.created,
                    accountId: newUser.accountId,
                    profiles: profiles
                });
    
            } catch (err) {
                if (err.code === 11000) {
                    return c.json({ message: "Username or email is already in use." }, 400);
                }
                return c.json({ message: "An unknown error has occurred, please try again later." }, 500);
            }
    
            return c.json({ message: `Successfully created an account with the username ${username}`, status: 200 });
        } catch (error) {
            console.error('Error processing request:', error);
            return c.json({ message: "Invalid request payload." }, 400);
        }
    });
}

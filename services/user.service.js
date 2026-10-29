const tokenService = require('../jwt/token.service');
const mongoose = require('mongoose');
const User = require('../models/user.module');
const bcrypt = require('bcrypt');
const UserProfile = require('../models/user.profile.model');
class UserService {
    async signup(name, email, password) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        return user;
    }

    async loginUser(email, password,) {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isActive === false) {
        throw new Error("Your account is inactive. You cannot login.");
    }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        const payload = {
            id: user._id,
            email: user.email,
            isActive: user.isActive,
        };
        const token = tokenService.generateToken(payload);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return { user: userWithoutPassword, token };
    }

    async getAllUsers() {
        // const users = await User.find({isActive:true}).populate('profile');
        //const users = await User.find({ isActive: true }, { password: 0 });
        //const users = await User.find({ isActive: true },{ password: 0 }).populate('profile');
        const users=await User.find({isActive:true});
        console.log(users,"User data list");
        const userIds=users.map((user)=>user._id);
        console.log(userIds,'///');
        const userProfiles=await UserProfile.find({
            user:{$in:userIds},
        });

        console.log(userProfiles,"UserProfile data list");

        const userwithprofiles = users.map((user) =>{
            const profile = userProfiles.find(
                (profile) =>profile.user.toString() === user._id.toString(),
            );

        return {
            ...user.toObject(),
            profile:profile||null,
        };
        });
       return userwithprofiles;
    }
    // Soft delete user using email
    async deleteUsers(email) {
        const user = await User.findOneAndUpdate(
            { email: email },
            { isActive: false },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
    async addUserProfile(userId, profileData){
            if(!mongoose.isValidObjectId(userId)){
                const user = await user.findById(userId);
                if(!user){
                    throw new Error("user not found ");
                }
                const userProfile = await UserProfile.create({
                    user: userId,
                    age: profileData.age,
                    dob: profileData.dob,
                    bio: profileData.bio,
                });
                user.profile= userProfile._id;
                await user.save();
                return userProfile;
            }
        }
}

module.exports = new UserService();
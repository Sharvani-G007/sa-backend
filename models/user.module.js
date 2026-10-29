const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,"Name is required"],
            trim: true
        },
        email:{
            type: String,
            required: [true,"Name is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password:{
            type: String,
            required:[true, "Password is required"],
            Select: true
        },
        profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
        },
        isActive:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User",userSchema);
module.exports = User;
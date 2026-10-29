const { default: mongoose } = require("mongoose");
const userService = require("../services/user.service");
const UserService = require("../services/user.service");
class UserController{
    async signup(req,res){
        try{
            const {name,email,password} = req.body;
        if(!name || !email || !password){
            res.status(400).json({message:" All Fields are Required!"})
        }
        const result = await UserService.signup(name,email,password);
        return res.status(201).json({message:"User created successfully",data:result});
        }
        catch(err){
            console.log(err.message);
            return res.status(500).json({message:"Internal server error "})

        }
    }
    async login (req,res){
        try{
            const {email, password}= req.body;
            if(!email || !password){
                return res.status(400).json({message:'both "email" and "password" are required'});
            }
            const loginData = await userService.loginUser(email, password);
            return res.status(200).json(loginData);

        } catch (error){
            res.status(401).json({error: error.message});
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                message: 'Users retrieved successfully',
                users: users
            });
        } catch (error) {
            console.error('Error fetching all users:', error);
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    }
    // Soft delete user using email
        async deleteUser(req, res) {
            try {
                const { email } = req.body;

                if (!email) {
                    return res.status(400).json({
                        message: "Email is required"
                    });
                }

                const user = await userService.deleteUsers(email);

                return res.status(200).json({
                    message: "User deleted successfully",
                    data: user
                });

            } catch (error) {
                return res.status(
                    error.message === "User not found" ? 404 : 500
                ).json({
                    message: error.message
                });
            }
        }
        async addUserProfile(req,res){
            try{
                const userId = req.user.id;
                const {age,dob,bio} = req.body;
                if(!userId){
                    return res.status(400).json({message:"User ID is Required"});
                }
                const newUserProfile = await userService.addUserProfile(userId,{age,dob,bio});
                return res.status(201).json(newUserProfile);
            }catch(err){
                if(err.code === 11000){
                    return res.status(409).json({message:"A Profile for this user already exists"});
                }
                if(err.message === "Invalid user ID"){
                    return res.status(400).json({message:err.message});
                }
                if(err.message === "User not found"){
                    return res.status(404).json({message:err.message});
                }
                console.error("Error creating user profile:", err);
                return res.status(500).json({message:"Internal server error"});
            }
        }
}
module.exports = new UserController();
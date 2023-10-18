import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModule.js'
import jwt from 'jsonwebtoken';
import generateToken from "../utils/generateToken.js";

//@desc Auth user and get the token
//@route POST /api/users/login
//@access Public
const authUser =asyncHandler( async (req,res)=>{
    const  { email, password } = req.body;

    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))) {
        
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else {
        res.status(401);
        throw new Error('Invalid email or password')
    }
});

//@desc check user password
//@route POST /api/user/forgetpassword
//@access Public
const checkEmailExist = asyncHandler(async (req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email})
    if(user) {
        res.status(200).json({email: user.email})
    }else {
        res.status(200).json({email: ''})
    }

})

//@desc forget user password
//@route PUT /api/users/forgetpassword
//@access Public
const forgetPassword = asyncHandler(async (req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(user) {
        if(password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })

    }else {
        res.status(400);
        throw new Error('Something went wrong')
    }
})

//@desc register user
//@route POST /api/users
//@access Public
const registerUser =asyncHandler( async (req,res)=>{
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error('User already exists')
    }
    const user = await User.create({
        name,
        email,
        password
    });

    if(user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else {
        res.status(400);
        throw new Error('Invalid user data')
    }
})

//@desc logout user / clear cookie
//@route POST /api/users/logout
//@access private
const logoutUser =asyncHandler( async (req,res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({message: 'Logged out successfully'})
})

//@desc get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile =asyncHandler( async (req,res)=>{
    const user = await User.findById(req.user._id)

    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else {
        res.status(400);
        throw new Error('User not found')
    }
})

//@desc update user profile
//@route PUT /api/users/profile
//@access private/admin
const updateUserProfile = asyncHandler( async (req,res)=>{
    const user = await User.findById(req.user._id);

    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }else {
        res.status(400);
        throw new Error('User not found')
    }
})

//@desc get users
//@route GET /api/users
//@access private
const getUsers =asyncHandler( async (req,res)=>{
    const users = await User.find({})
    res.status(200).json(users)
})

//@desc get user by id
//@route GET /api/users/:id
//@access private/admin
const getUserById =asyncHandler( async (req,res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if(user) {
        res.status(200).json(user);
    }else {
        res.status(404);
        throw new Error("User not found")
    }
    
})

//@desc delete user
//@route DELETE /api/users/:id
//@access private/admin
const deleteUser =asyncHandler( async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user')
        }
        await User.deleteOne({_id:user._id})
        res.status(200).json({message: 'User deleted successfully'})
    }else {
        res.status(404);
        throw new Error('User not found')
    }
})

//@desc update user
//@route PUT /api/users/:id
//@access private/admin
const updateUser =asyncHandler( async (req,res)=>{
    const user =await User.findById(req.params.id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }else {
        res.status(404);
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    checkEmailExist,
    forgetPassword
}


import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModule.js'
import jwt from 'jsonwebtoken';

//@desc Auth user and get the token
//@route POST /api/users/login
//@access Public
const authUser =asyncHandler( async (req,res)=>{
    const  { email, password } = req.body;

    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))) {
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{
            expiresIn:'30d'
        });

        //set jwt as http-only cookie
        res.cookie('jwt',token, {
            httpOnly:true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000  //30days
        })
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else {
        res.status(401);
        throw new Error('Invalid email or password')
    }
})

//@desc register user
//@route POST /api/users
//@access Public
const registerUser =asyncHandler( async (req,res)=>{
    res.send('register user')
})

//@desc logout user / clear cookie
//@route POST /api/users/logout
//@access private
const logoutUser =asyncHandler( async (req,res)=>{
    res.send('logout user')
})

//@desc get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile =asyncHandler( async (req,res)=>{
    res.send('get user profile')
})

//@desc update user profile
//@route PUT /api/users/profile
//@access private/admin
const updateUserProfile =asyncHandler( async (req,res)=>{
    res.send('update user profile')
})

//@desc get users
//@route GET /api/users
//@access private
const getUsers =asyncHandler( async (req,res)=>{
    res.send('get users')
})

//@desc get user by id
//@route GET /api/users/:id
//@access private/admin
const getUserById =asyncHandler( async (req,res)=>{
    res.send('get user by id')
})

//@desc delete user
//@route DELETE /api/users/:id
//@access private/admin
const deleteUser =asyncHandler( async (req,res)=>{
    res.send('delete user')
})

//@desc update user
//@route PUT /api/users/:id
//@access private/admin
const updateUser =asyncHandler( async (req,res)=>{
    res.send('update user')
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
    updateUser
}


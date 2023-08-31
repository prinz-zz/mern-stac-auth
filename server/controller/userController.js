import asyncHandler from 'express-async-handler';
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js';

//desc auth user/set token
//routes POST /api/users/auth
//Access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }
    //check if user exists
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {

        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }

})

//desc Register user
//routes POST /api/users
//Access Public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }
    //check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    //create a new user
    const user = await User.create({
        name,
        email,
        password
    })
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})


//desc logout user
//routes POST /api/users/logout
//Access Public
const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'user logged out' })
})

//desc get user profile
//routes GET /api/users/progilr
//Access Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    res.status(200).json({ user })
})

//desc Update user profile
//routes PUT /api/users/progilr
//Access Private
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);
    

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        

        if (req.body.password) {
            user.password = req.body.password;
        }
        
        const updatedUser = await user.save();


        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        })

    } else {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ message: 'user updated' })
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}
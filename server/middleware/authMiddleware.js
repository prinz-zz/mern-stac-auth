import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protectedRoute = asyncHandler(async (req, res, next) => {

    let token;

    token = req.cookies.jwt;

    if (token) {

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');

            next();

        } catch (error) {
            res.status(401);
            throw new Error('Unauthorized!, Invalid token');
        }

    } else {
        res.status(401);
        throw new Error('Unauthorized!, No token');
    }

});

export {
    protectedRoute,
}
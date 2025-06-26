import mongoose from 'mongoose';
import userModel from "../Models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";


//what is a transaction?
export const signUp = async (req, res, next) => {

    const session = await mongoose.startSession(); //Starts a mongo

    try {
        await session.startTransaction();  //begins a transaction

        // Extract user data from request body
        const { name, password, email } = req.body;  //what we are required to to put in the postman to pass and get the data

        // Check if user already exists
        const existingUser = await userModel.findOne({ email }).session(session); //checks for a user based of the email. if it exists before youd see a 409 conflicting error

        if (existingUser) {  //checks if existing user ===exists in the database it cancels the operation
            await session.abortTransaction(); //ends the transaction
            session.endSession();
            return res.status(409).json({ //sends a 409 with a message to let the user know
                statusCode: 409,
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);  //generates a salt for the password hashing
        const hashedPassword = await bcrypt.hash(password, salt); // hashes the password with the salt

        // Create new user
        const newUsers = await userModel.create([{name, email, password: hashedPassword}], { session }); //creates a user based of the user model whcih has a name, email and password that is being hashed

        // Generate JWT token
        const token = jwt.sign({ userId: newUsers[0]._id}, JWT_SECRET, { expiresIn: '30d' }); //we are creating secure web token that is signed with the user id and the JWT_SECRET. The token expires in 30 days

        // Commit transaction
        await session.commitTransaction(); //commits the transaction if everything is successful
        session.endSession(); //

        // Return success response
        return res.status(201).json({
            success: true,
            message: "User signed up successfully",
            data:{
                token,
                user: newUsers[0]
            }
        });

    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();

        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during signup",
            error: error.message
        });
    }
};

export const signIn = async (req, res, next) => {  // Added async here
    try {
        const { email, password } = req.body;

        // Changed User to userModel to match your import
        const user = await userModel.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user:user
            }
        });
    } catch (error) {  // Added error parameter here
        next(error);  // Properly pass the error to the error handler
    }
};

//contains logic for sign up
export const signOut = (req, res, next) => {}
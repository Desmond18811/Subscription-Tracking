
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import User from "../Models/user.model.js";

//authentication middleware that verifies the JWT token sent in the request headers
//someone is trying to make a request to access user details or perform an action that requires authentication ->authorize middleware -> if valid -> next -> get user details
   const authorize = async (req, res, next) => {
       try {
           //Extract the token from the Authorization header
           let token;
           //check if the Authorization header is present and starts with 'Bearer'
           if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
             //this extracts the token part from the Authorization header
               token = req.headers.authorization.split(' ')[1];
           }
           // If the token is not present, return an error response
           if (!token) {
               return res.status(401).json({
                   success: false,
                   message: "Authentication token is missing"
               });
           }
           // Verify the token
           const decoded = jwt.verify(token, JWT_SECRET);
           // If the token is valid, find the user by ID from the decoded token that is in the databse
           const user = await User.findById(decoded.userId); // Exclude password from user data
              // If the user is not found, return an error response
           if (!user) {
               return res.status(404).json({
                   success: false,
                   message: "User not found"
               });
           }
           req.user = user; // Attach user to request object
           next(); // Call the next middleware or route handler
       } catch (error) {
           console.error("Authentication error:", error);
           return res.status(401).json({
               success: false,
               message: "Authentication failed",
               error: error.message
           });
       }

   }

   export default authorize
import {Router} from "express";
import {signIn, signOut, signUp} from "../Controllers/auth.controller.js";


const authRouter = Router()


// This file contains the routes for authentication
// It includes routes for signing up, signing in, and signing out
// The routes are defined using the express Router
// The signUp, signIn, and signOut functions are imported from the auth.controller.js file
//Logic for user authentication is handled in the auth.controller.js file
// The routes are defined using the post method of the Router

//Path:/api/v1/auth/sign-up(POST
authRouter.post('/sign-up', signUp)
//Path:/api/v1/auth/sign-in(POST)
authRouter.post('/sign-in', signIn)
//Path:/api/v1/auth/sign-out(POST)
authRouter.post('/sign-out', signOut)


export default authRouter;
import express from 'express';
import cookieParser from 'cookie-parser';

import {PORT} from "./config/env.js";
import userRouter from "./Routes/user.routes.js";
import authRouter from "./Routes/auth.routes.js";
import subscriptionRouter from "./Routes/subscription.routes.js";
import connectToDatabase from "./DATABASE/mongodb.js";
import errorMiddleware from "./Middleware/error.middleware.js";
import arjectMiddleware from "./Middleware/arject.middleware.js";
import workflowRouter from "./Routes/workflow.routes.js";

const app = express();

app.use (express.json()) //middleware
app.use(express.urlencoded({extended: true})) //middleware for parsing urlencoded data
app.use(cookieParser()) //middleware for parsing cookies
app.use(arjectMiddleware) // Arcjet middleware for security and rate limiting

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/workflows', workflowRouter)

app.get('/',(req, res)=>{
    res.send("Server is up and running")
});

app.use(errorMiddleware) //error handling middleware

app.listen(PORT, async ()=>{
    console.log(`🚀 Server is running on http://localhost:${PORT}`)

    await connectToDatabase()
})




export default app;
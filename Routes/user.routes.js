import {Router} from "express";
import {getUser, getUsers} from "../Controllers/user.controller.js";
import authorize from "../Middleware/auth.middleware.js";



const userRouter = Router()


//GET ALL USERS
//Path /api/v1/users
userRouter.get('/', getUsers)

userRouter.get('/:id', authorize, getUser)


userRouter.post('/', (req, res) =>{
    res.send({title: 'CREAT A NEW USER'})
})

userRouter.put('/:id', (req, res) =>{
    res.send({title: 'UPDATE USER BY ID'})
})

userRouter.delete('/:id', (req, res) =>{
    res.send({title: 'DELETE USER'})
})

export default userRouter;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
      required: [true, 'User Name is required'],
        trim: true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type: String,
        required: [true, 'User Email is required'],
       unique:true,
        trim: true,
        lowercase: true,
        minLength:2,
        maxLength:50,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

export default User;


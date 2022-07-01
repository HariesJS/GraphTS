import { Schema, model } from "mongoose";

const User = new Schema({
    name: String,
    age: Number,
    cars: Array,
    password: String
})

export default model('User', User)
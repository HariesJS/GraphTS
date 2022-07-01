import { Schema, model } from 'mongoose'

const Car = new Schema({
    car: String
})

export default model('Car', Car)
import mongoose, { Schema, model, Types } from "mongoose";

const disasterSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [2, 'Name should be at least 2 characters long!'],
    },
    type: {
        type: String,
        required: [true, 'Type is required!'],
        enum: [
            'Wildfire',
            'Flood',
            'Earthquake',
            'Hurricane',
            'Drought',
            'Tsunami',
            'Other',
        ]
    },
    year: {
        type: Number,
        required: [true, 'Year is required!'],
        min: [0, 'Year cannot be 0 or less!'],
        max: [2024, 'Year cannot be more than 2024!']
    },
    location: {
        type: String,
        required: [true, 'Location is required!'],
        minLength: [3, 'Location should be at least 3 characters long!'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        match:/^https?:\/\//, 
        // /^http:\/\//
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minlength: [10, 'Description must be at least 10 characters long'],
    },
    interestedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Disaster = model('Disaster', disasterSchema);

export default Disaster;
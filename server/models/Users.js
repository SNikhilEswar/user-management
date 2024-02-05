const mongoose = require('mongoose');

// Define the user schema
const UserSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/ // Basic email format validation
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    selectedDate: {
        type: Date,
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Basic phone number format validation
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    },
    delete: {
        type: Boolean,
        default: false
    }
});

// Create a Mongoose model based on the schema
const UserModel = mongoose.model("users", UserSchema);

// Export the model for use in other parts of the application
module.exports = UserModel;

// const mongoose = require('mongoose');

// // Define the user schema
// const UserSchema = new mongoose.Schema({
//     uniqueId: String,          // Unique identifier for the user
//     firstName: String,         // User's first name
//     lastName: String,          // User's last name
//     email: String,             // User's email address
//     gender: String,            // User's gender
//     selectedDate: Date,        // Date when the user was selected 
//     fullAddress: String,       // User's full address
//     phoneNumber: Number,       // User's phone number
//     status: String,            // User's status (e.g., active, inactive)
//     delete: Boolean            // Boolean indicating whether the user is deleted
// });

// // Create a Mongoose model based on the schema
// const UserModel = mongoose.model("users", UserSchema);

// // Export the model for use in other parts of the application
// module.exports = UserModel;

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

const express = require('express');
const router = express();
const UserModel = require('../models/Users');
const jwt = require('jsonwebtoken');


// Hardcoded user for demonstration purposes
const hardcodedUser = {
  username: 'userManagement@mail.com',
  password: 123456789,
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the hardcoded user
  if (username === hardcodedUser.username && password === hardcodedUser.password) {
    // Generate a JWT token
    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});


// Create a new user
router.post('/users', (req, res) => {
  UserModel.create(req.body)
    .then(users => res.status(201).json(users))
    .catch(err => res.status(400).json({ error: err.message }));
});


//  // Get a list of all active users.
 router.get(`/users`, (req, res) => {
  UserModel.find({})
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({ message: 'No users found' });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(err => res.status(500).json({ error: err.message}));
});

// // Get details of a specific user by ID.
router.get('/users/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findById({ _id: id })
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});



//Update details of a user by ID.
router.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const updatedUser = await UserModel.findByIdAndUpdate({ _id: id },
      {
        uniqueId: req.body.uniqueId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        selectedDate: req.body.selectedDate,
        fullAddress: req.body.fullAddress,
        phoneNumber: req.body.phoneNumber,
        status: req.body.status,
        delete: req.body.delete,
      },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      // If user not found, return a 404 status with a message
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user
    res.json(updatedUser);
  } catch (err) {
    // Handle other errors (e.g., validation errors) with a 400 status
    res.status(400).json({ error: err.message });
  }
});


// Update multiple users by IDs
router.delete('/users/bulk', async (req, res) => {
  try {
    const idsToUpdate = req.body.ids;
    const deleteValue = req.body.delete;

    const result = await UserModel.updateMany(
      { _id: { $in: idsToUpdate } },
      { $set: { delete: deleteValue } }
    );

    // Check if any documents were modified
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No matching users found' });
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Get a list of all deleted users.

router.get('/deletedUsers', (req, res) => {
  UserModel.find({ delete: true })
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({ message: 'No deleted users found' });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(err => {
      console.error(err);  // Log the error
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

router.post('/addAll', async (req, res) => {
  try {
    const bulkUsers = req.body.users; // Assuming 'users' is an array of user objects

    // Validate and insert the bulk users into the database
    const insertedUsers = await UserModel.insertMany(bulkUsers);

    res.status(201).json({ success: true, insertedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
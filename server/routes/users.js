const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { config } = require('../config/secret');
const { auth } = require('../middlewares/auth');
const UserModel = require('../models/user');
const { createToken } = require('../helpers/userHelper')


// Function to validate login data


router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new UserModel({ username, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.json({ username: newUser.username, id: newUser._id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
 
  try{
    const user = await UserModel.findOne({username: username});

  if (!user) {
    return res.status(401).json({ error: "Authentication failed", message: "Invalid credentials" });
  }

  console.log("password:", password);
  console.log("Hash:", user.password);
  const passwordMatch = await bcrypt.compare(password, user.password);

  console.log("Password match:", passwordMatch);
  if (passwordMatch) {
    // Use your custom createToken function
    const token = createToken(user._id);
    const decodedToken = jwt.verify(token, config.tokenSecret);

    console.log("Password match:", passwordMatch);

    res.status(200).json({ message: "Login successful!", token ,username});
  } else {
    res.status(401).json({ error: "Authentication failed", message: "Invalid credentials" });
  }
} catch (error) {
  console.error("Login error:", error);
  res.status(500).json({ error: "Internal Server Error", message: error.message });
}
});


// User Registration
// router.post('/', async (req, res) => {
//   try {
//     console.log('Received a POST request to add a user');

//     const { username, password } = req.body;
//     console.log('Request Body:', req.body);

//     // Validate user registration data
//     const registrationSchema = Joi.object({
//       username: Joi.string().min(2).max(99).required(),
//       password: Joi.string().min(3).max(99).required(),
//     });

//     const { error: registrationError } = registrationSchema.validate(req.body);
//     if (registrationError) {
//       return res.status(400).json(registrationError.details);
//     }

//     // Check if the username already exists
//     const existingUser = await UserModel.findOne({ username });
//     if (existingUser) {
//       console.log('Username already exists');
//       return res.status(400).json({ msg: 'Username already exists' });
//     }

//     // Hash the password
//     console.log(password);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);
//     // Create a new user
//     const newUser = await UserModel.create({
//       username,
//       password: hashedPassword,
//     });

//     console.log('User created successfully:', newUser);

//     // Create a token for the new user
//     const token = createToken(newUser._id, newUser.role);
//     console.log('Token generated:', token);

//     res.json({ token });
//   } catch (error) {
//     console.error('Error adding user:', error);
//     res.status(500).json({ msg: 'Internal Server Error' });
//   }
// });

// // User Login
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Validate login data
//     const loginSchema = Joi.object({
//       username: Joi.string().min(2).max(99).required(),
//       password: Joi.string().min(3).max(99).required(),
//     });

//     const { error: loginError } = loginSchema.validate(req.body);
//     if (loginError) {
//       return res.status(400).json(loginError.details);
//     }

//     // Check if the user exists
//     const user = await UserModel.findOne({ username });
//     if (!user) {
//       console.log('User not found');

//       return res.status(401).json({ msg: 'User not found' });
//     }
//     console.log('User found:', user.username, user.password);
//     console.log('Password before encryption:', password);

//     // Compare the provided password with the hashed password in the database
//     // let authPassword = await bcrypt.compare(password.trim(), user.password.trim());
//     // console.log(authPassword);
//     // if (!authPassword) {
//     //   return res.status(401).json({ msg: "Password is worng ", code: 2 });
//     // }
//     console.log(await bcrypt.compare(password, user.password));
//     if(!await bcrypt.compare(password, user.password)){
//             return res.status(401).json({ msg: "Password is worng ", code: 2 });

//     }

//     // Generate a token for the authenticated user
//     const token = createToken(user._id, user.role);
//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'Internal Server Error' });
//   }
// });
router.put('/update/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Update the user details
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      req.body,
      { new: true } // Return the modified document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// DELETE User
router.delete('/delete/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Delete the user
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});










module.exports = router;

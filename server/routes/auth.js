const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

// Register route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save new user to the database
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // Generate a JWT token
      const payload = { user: { id: newUser.id } };
      const token = jwt.sign(payload, "your_jwt_secret_key", { expiresIn: "1h" });

      // Send the token as response
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

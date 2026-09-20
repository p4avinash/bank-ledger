const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

const userModel = require("../models/user.model");
const { default: mongoose } = require("mongoose");

/**
 * - user register controller
 * - POST /api/auth/register
 * */
const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await userModel.findOne({ email });

  if (emailAlreadyExists) {
    return res.status(422).json({
      message: "User already exists with email",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });

  await emailService.sendRegistrationEmail(user.email, user.name);
};

/**
 * - user login controller
 * - POST /api/auth/login
 * */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await userModel.findOne({ email }).select("+password");

  if (!foundUser) {
    return res.status(401).json({
      message: "Email or password is invalid",
    });
  }

  const isValidPassword = await foundUser.comparePassword(password);

  if (!isValidPassword) {
    res.status(401).json({
      message: "Email or password is invalid",
    });
  }

  const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    user: {
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
    },
    token,
  });

  res.send(1);
};

module.exports = { registerUser, loginUser };

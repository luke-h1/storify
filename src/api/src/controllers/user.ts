import bcrypt from 'bcryptjs';
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import { validateRegister } from '../validations/validateRegister';

// @desc    login & get token
// @route   POST /api/users/login
// @access  Public

const login = asyncHandler(async (req, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({
      errors: [
        {
          field: 'email',
          message: 'incorrect credentials',
        },
      ],
    });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const register = asyncHandler(async (req, res: Response) => {
  const { email, password, firstName, lastName, bio } = req.body;
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    res.status(401).json({
      errors: [
        {
          field: 'email',
          message: 'Email already taken',
        },
      ],
    });
  }

  const errors = validateRegister(email, password, bio, firstName, lastName);
  if (errors) {
    res.status(400).json({
      errors,
    });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getProfile = asyncHandler(async (req, res: Response) => {
  const user = await User.findById(req?.user?._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res: Response) => {
  const user = await User.findById(req?.user?._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'user not found' });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (_, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.status(200).json({ message: 'user removed' });
  } else {
    res.status(404).json({ message: 'User not found with that ID' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'user not found' });
  }
});

export {
  login,
  register,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
  getUser,
  updateUser,
};
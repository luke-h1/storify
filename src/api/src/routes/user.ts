import express from 'express'

import {
  deleteUser,
  getProfile,
  getUser,
  getUsers,
  login,
  register,
  updateProfile,
  updateUser,
} from '../controllers/user';
import { protect, admin } from '../middleware/auth'

const router = express.Router();

router.route('/').post(register).get(protect, admin, getUsers)

router.post('/login', login)

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile)

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUser)
  .put(protect, admin, updateUser)

export default router;

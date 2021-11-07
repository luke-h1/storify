import { User } from '@storify/common/src/types';
import bcrypt from 'bcryptjs';
import { model, Schema } from "mongoose";


const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true,
  }
)
userSchema.methods.matchPassword = async (password) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return bcrypt.compare(password, this.password)
}

userSchema.pre('save', async (next) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt)
})
const user = model('User', userSchema);
export default user;

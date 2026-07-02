import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
  name: string
  username: string
  email: string
  password: string
  tagline?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tagline: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
)

const User = mongoose.model<IUser>('User', userSchema)

export default User
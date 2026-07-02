import mongoose, { Schema, Document } from 'mongoose'

interface IWall extends Document {
  capsule: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  isAnonymous: boolean
  likedBy: mongoose.Types.ObjectId[]
  likes: number
  createdAt: Date
  updatedAt: Date
}

const wallSchema = new Schema<IWall>(
  {
    capsule: {
      type: Schema.Types.ObjectId,
      ref: 'Capsule',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Wall = mongoose.model<IWall>('Wall', wallSchema)

export default Wall
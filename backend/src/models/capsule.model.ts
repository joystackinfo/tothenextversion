import mongoose, { Schema, Document } from 'mongoose'

interface ICapsule extends Document {
  user: mongoose.Types.ObjectId
  title: string
  message: string
  currentAge: number
  currentMood: string
  currentGoal?: string
  currentHobby?: string
  currentSong?: string
  currentShow?: string
  whatWillChange?: string
  whatSkillsWillYouLearn?: string
  whatAreYouWorriedAbout?: string
  unlockDate: Date
  isLocked: boolean
  isPublic: boolean
  emailSent: boolean
  photo?: string
  createdAt: Date
  updatedAt: Date
}

const capsuleSchema = new Schema<ICapsule>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    currentAge: {
      type: Number,
      required: true,
    },
    currentMood: {
      type: String,
      required: true,
    },
    currentGoal: String,
    currentHobby: String,
    currentSong: String,
    currentShow: String,
    whatWillChange: String,
    whatSkillsWillYouLearn: String,
    whatAreYouWorriedAbout: String,
    unlockDate: {
      type: Date,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    photo: String,
  },
  { timestamps: true }
)

const Capsule = mongoose.model<ICapsule>('Capsule', capsuleSchema)

export default Capsule
import mongoose, { Document } from 'mongoose';
interface ICapsule extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    currentAge: number;
    currentMood: string;
    currentGoal?: string;
    currentHobby?: string;
    currentSong?: string;
    currentShow?: string;
    whatWillChange?: string;
    whatSkillsWillYouLearn?: string;
    whatAreYouWorriedAbout?: string;
    unlockDate: Date;
    isLocked: boolean;
    isPublic: boolean;
    emailSent: boolean;
    photo?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Capsule: mongoose.Model<ICapsule, {}, {}, {}, mongoose.Document<unknown, {}, ICapsule, {}, mongoose.DefaultSchemaOptions> & ICapsule & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICapsule>;
export default Capsule;

import mongoose, { Document } from 'mongoose';
interface IWall extends Document {
    capsule: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    isAnonymous: boolean;
    likedBy: mongoose.Types.ObjectId[];
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Wall: mongoose.Model<IWall, {}, {}, {}, mongoose.Document<unknown, {}, IWall, {}, mongoose.DefaultSchemaOptions> & IWall & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWall>;
export default Wall;

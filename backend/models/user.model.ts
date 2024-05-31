import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
    fullName: string;
    email: string;
    password: string;
    createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;

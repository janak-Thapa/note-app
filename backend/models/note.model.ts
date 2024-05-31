import mongoose, { Schema, Document } from 'mongoose';

export interface NoteDocument extends Document {
    title: string;
    content: string;
    tags: string[];
    isPinned: boolean;
    userId: string;
    createdAt: Date;
}

const noteSchema = new Schema<NoteDocument>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const NoteModel = mongoose.model<NoteDocument>('Note', noteSchema);

export default NoteModel;

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const chatSessionSchema = new Schema(
    {
        _id: { type: String },
        title: { type: String, required: true },
        userId: { type: String, ref: 'User', required: true },
        isArchived: { type: Boolean, default: false },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
    { collection: 'chatSession' }
);

const chatMessageSchema = new Schema(
    {
        _id: { type: String },
        sessionId: { type: String, ref: 'ChatSession', required: true },
        messageIndex: { type: Number, required: true },
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        variantIndex: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        metadata: {
            model: { type: String },
            tokens: { type: Number },
            responseTime: { type: Number },
            temperature: { type: Number },
        },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
    { collection: 'chatMessage' }
);

chatSessionSchema.index({ userId: 1, createdAt: -1 });
chatSessionSchema.index({ userId: 1, isArchived: 1 });

chatMessageSchema.index({ sessionId: 1, messageIndex: 1 });
chatMessageSchema.index({ sessionId: 1, messageIndex: 1, variantIndex: 1 });
chatMessageSchema.index({ sessionId: 1, isActive: 1 });

const ChatSession = model('ChatSession', chatSessionSchema);
const ChatMessage = model('ChatMessage', chatMessageSchema);

export { ChatSession, ChatMessage };

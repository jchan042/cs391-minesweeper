// Done by Jocelyn Chan

// models/Score.js

import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    userId:      { type: String, required: true },  // from OAuth session
    username:    { type: String, required: true },
    avatar:      { type: String, default: '' },      // profile pic URL from OAuth
    difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    bestTime:    { type: Number, default: null }, // null means no wins yet
    wins:        { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
}, { timestamps: true });

// Prevent model re-registration during Next.js hot reload
export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);
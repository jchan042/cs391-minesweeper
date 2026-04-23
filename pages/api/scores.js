// pages/api/scores.js
// Called by the game components when a round finishes

import { connectDB } from '@/lib/mongoose';
import Score from '@/models/Score';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    await connectDB();

    const { userId, username, avatar, difficulty, time, won } = req.body;

    if (!userId || !username || !difficulty || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find existing record for this user + difficulty, or create one
    const existing = await Score.findOne({ userId, difficulty });

    if (!existing) {
        // First time playing this difficulty
        await Score.create({
            userId, username, avatar, difficulty,
            bestTime: time,
            wins: won ? 1 : 0,
            gamesPlayed: 1,
        });
    } else {
        // Update: only replace bestTime if this run was faster
        await Score.findOneAndUpdate(
            { userId, difficulty },
            {
                $set: {
                    bestTime: won && time < existing.bestTime ? time : existing.bestTime,
                    username, // keep name fresh in case they change it
                    avatar,
                },
                $inc: {
                    gamesPlayed: 1,
                    wins: won ? 1 : 0,
                },
            }
        );
    }

    res.status(200).json({ ok: true });
}
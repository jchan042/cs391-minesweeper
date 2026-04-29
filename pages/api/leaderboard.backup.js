// Done by Jocelyn Chan

// pages/api/leaderboard.js

import { connectDB } from '@/lib/mongoose';
import Score from '@/models/Score';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    await connectDB();

    const { difficulty = 'medium' } = req.query;

    // Get top 20 players sorted by bestTime ascending (fastest first)
    const scores = await Score.find({ difficulty })
        .sort({ bestTime: 1 })
        .limit(20)
        .lean(); // .lean() returns plain JS objects, faster for read-only

    res.status(200).json(scores);
}
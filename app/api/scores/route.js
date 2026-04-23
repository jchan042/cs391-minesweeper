// app/api/scores/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Score from '@/models/Score';

export async function POST(request) {
    const body = await request.json();
    const { userId, username, avatar, difficulty, time, won } = body;

    if (!userId || !username || !difficulty || !time) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const existing = await Score.findOne({ userId, difficulty });

    if (!existing) {
        // First game on this difficulty
        await Score.create({
            userId, username, avatar, difficulty,
            bestTime: time,
            wins: won ? 1 : 0,
            gamesPlayed: 1,
        });
    } else {
        // Only update bestTime if this run was faster and they won
        await Score.findOneAndUpdate(
            { userId, difficulty },
            {
                $set: {
                    bestTime: won && time < existing.bestTime ? time : existing.bestTime,
                    username,
                    avatar,
                },
                $inc: {
                    gamesPlayed: 1,
                    wins: won ? 1 : 0,
                },
            }
        );
    }

    return NextResponse.json({ ok: true });
}
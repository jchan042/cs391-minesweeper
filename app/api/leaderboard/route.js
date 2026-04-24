// app/api/leaderboard/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Score from '@/models/Score';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') ?? 'medium';

    await connectDB();

    // Only show players who have actually won at least once
    const scores = await Score.find({ difficulty, bestTime: { $ne: null } })
        .sort({ bestTime: 1 })
        .limit(20)
        .lean();

    return NextResponse.json(scores);
}
// app/api/stats/route.ts
// Returns the logged-in user's scores across all difficulties
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Score from '@/models/Score';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await connectDB();

    // Get this user's record for each difficulty
    const scores = await Score.find({ userId }).lean();

    return NextResponse.json(scores);
}
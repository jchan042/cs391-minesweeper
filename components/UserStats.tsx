"use client";

// components/UserStats.tsx
// Shows the logged-in user's personal stats across all difficulties
import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface UserScore {
    _id: string;
    difficulty: 'easy' | 'medium' | 'hard';
    bestTime: number;
    wins: number;
    gamesPlayed: number;
}

interface UserStatsProps {
    userId?: string;
    username?: string;
}

// Styled Components

const Wrap = styled.div`
    max-width: 640px;
    margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 1rem 0;
`;

const CardsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
`;

const Card = styled.div`
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
`;

const DifficultyLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #999;
    margin-bottom: 8px;
`;

const BigStat = styled.div`
    font-size: 28px;
    font-weight: 700;
    color: #111;
`;

const StatLabel = styled.div`
    font-size: 11px;
    color: #999;
    margin-top: 2px;
`;

const SubStats = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
`;

const SubStat = styled.div`
    text-align: center;
`;

const NoData = styled.div`
    font-size: 13px;
    color: #bbb;
    margin-top: 6px;
`;

// Helpers

// Calculates win rate as a percentage string
function winRate(wins: number, gamesPlayed: number): string {
    if (gamesPlayed === 0) return '0%';
    return `${Math.round((wins / gamesPlayed) * 100)}%`;
}

const DIFFICULTIES: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

// Component

export default function UserStats({ userId, username }: UserStatsProps) {
    // null = loading, Score[] = fetched
    const [stats, setStats] = useState<UserScore[] | null>(null);

    useEffect(() => {
        if (!userId) return;
        setStats(null);
        fetch(`/api/stats?userId=${userId}`)
            .then((r) => r.json())
            .then((data: UserScore[]) => setStats(data))
            .catch(() => setStats([]));
    }, [userId]);

    // If no user is logged in
    if (!userId) {
        return <p style={{ color: '#888' }}>Sign in to see your stats.</p>;
    }

    return (
        <Wrap>
            <SectionTitle> {username ? `${username}'s Stats` : 'Your Stats'}</SectionTitle>

            {stats === null ? (
                <p style={{ color: '#888' }}>Loading...</p>
            ) : (
                <CardsRow>
                    {/* One card per difficulty */}
                    {DIFFICULTIES.map((diff) => {
                        // Find the user's record for this difficulty
                        const record = stats.find((s) => s.difficulty === diff);

                        return (
                            <Card key={diff}>
                                <DifficultyLabel>{diff}</DifficultyLabel>

                                {!record ? (
                                    // User hasn't played this difficulty yet
                                    <NoData>No games yet</NoData>
                                ) : (
                                    <>
                                        {/* Best time is the main stat */}
                                        <BigStat>{record.bestTime === Infinity ? '—' : `${record.bestTime}s`}</BigStat>
                                        <StatLabel>best time</StatLabel>

                                        <SubStats>
                                            <SubStat>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{record.wins}</div>
                                                <div style={{ fontSize: 11, color: '#999' }}>wins</div>
                                            </SubStat>
                                            <SubStat>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{record.gamesPlayed}</div>
                                                <div style={{ fontSize: 11, color: '#999' }}>played</div>
                                            </SubStat>
                                            <SubStat>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{winRate(record.wins, record.gamesPlayed)}</div>
                                                <div style={{ fontSize: 11, color: '#999' }}>win rate</div>
                                            </SubStat>
                                        </SubStats>
                                    </>
                                )}
                            </Card>
                        );
                    })}
                </CardsRow>
            )}
        </Wrap>
    );
}
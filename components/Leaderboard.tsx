"use client";

// components/Leaderboard.tsx
// Displays top players per difficulty, fetched from /api/leaderboard
import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Score {
    _id: string;
    userId: string;
    username: string;
    bestTime: number;
    wins: number;
    gamesPlayed: number;
}

interface LeaderboardProps {
    currentUserId?: string;
}

// Styled Components

const Wrap = styled.div`
  padding: 1.5rem 0;
  max-width: 640px;
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  padding: 4px;
  border-radius: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: 5px 14px;
    font-size: 13px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
    font-weight: ${({ $active }) => ($active ? '600' : '400')};
    box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
    transition: all 0.15s;
`;

const PodiumGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 1.25rem;
`;

const PodCard = styled.div<{ $gold: boolean }>`
  background: #fff;
  border: 1px solid ${({ $gold }) => ($gold ? '#BA7517' : '#e5e5e5')};
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e8edf5;
  color: #3355aa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  margin: 6px auto;
`;

const Row = styled.div<{ $you: boolean }>`
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 12px;
  background: ${({ $you }) => ($you ? '#eef3fc' : '#fff')};
  border: 1px solid ${({ $you }) => ($you ? '#90a8e0' : '#e5e5e5')};
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 6px;
`;

// Helper

// Converts a userId into two initials for the avatar circle
function initials(name: string | undefined): string {
    return name?.slice(0, 2).toUpperCase() ?? '??';
}

// Component

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
    // currentUserId comes from NextAuth session (passed in by parent page)
    const [difficulty, setDifficulty] = useState<string>('medium');
    const [scores, setScores] = useState<Score[] | null>(null);

    // Re-fetch whenever difficulty tab changes
    useEffect(() => {
        setScores(null); // reset to null to trigger loading state
        fetch(`/api/leaderboard?difficulty=${difficulty}`)
            .then((r) => r.json())
            .then((data: Score[]) => setScores(data))
            .catch(() => setScores([]));
    }, [difficulty]);

    // Top 3 go in the podium, rest go in the list below
    const podium = scores?.slice(0, 3) ?? [];
    const rest   = scores?.slice(3) ?? [];
    const medals = ['🥇', '🥈', '🥉'];
    // Re-order so gold is visually in the center
    const podiumOrder = [podium[1], podium[0], podium[2]];

    return (
        <Wrap>
            <Header>
                <Title> Leaderboard</Title>
                <Tabs>
                    {['easy', 'medium', 'hard'].map((d) => (
                        <Tab key={d} $active={difficulty === d} onClick={() => setDifficulty(d)}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </Tab>
                    ))}
                </Tabs>
            </Header>

            {scores === null ? (
                <p style={{ color: '#888' }}>Loading...</p>
            ) : (
                <>
                    {/* Podium: top 3 */}
                    <PodiumGrid>
                        {podiumOrder.map((player, i) => {
                            if (!player) return <div key={i} />;
                            // Map visual position back to actual rank
                            const rank = i === 0 ? 1 : i === 1 ? 0 : 2;
                            return (
                                <PodCard key={player._id} $gold={rank === 0}>
                                    <div style={{ fontSize: 20 }}>{medals[rank]}</div>
                                    <Avatar>{initials(player.username)}</Avatar>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{player.username}</div>
                                    <div style={{ fontSize: 22, fontWeight: 700 }}>{player.bestTime}s</div>
                                    <div style={{ fontSize: 11, color: '#999' }}>best time</div>
                                </PodCard>
                            );
                        })}
                    </PodiumGrid>

                    {/* Rows: rank 4 and below */}
                    {rest.map((player, i) => {
                        const isYou = player.userId === currentUserId;
                        return (
                            <Row key={player._id} $you={isYou}>
                                <div style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>{i + 4}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Avatar>{initials(player.username)}</Avatar>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                                            {player.username}
                                            {isYou && (
                                                <span style={{ fontSize: 10, background: '#d0dff8', color: '#2244aa', borderRadius: 4, padding: '1px 6px', marginLeft: 6 }}>
                          you
                        </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#999' }}>{player.gamesPlayed} games</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 15, fontWeight: 600 }}>{player.bestTime}s</div>
                                    <div style={{ fontSize: 11, color: '#999' }}>{player.wins} wins</div>
                                </div>
                            </Row>
                        );
                    })}
                </>
            )}
        </Wrap>
    );
}
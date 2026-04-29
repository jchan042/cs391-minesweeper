// Done by Jocelyn Chan

"use client";

// app/stats/page.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserStats from '@/components/UserStats';
import Leaderboard from '@/components/Leaderboard';

export default function StatsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect to home if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    if (status === 'loading') return <p style={{ padding: '2rem', color: '#888' }}>Loading...</p>;

    console.log(session);

    return (
        <main style={{ padding: '2rem' }}>
            <UserStats
                userId={session?.user?.email ?? undefined}
                username={session?.user?.name ?? undefined}
            />

            <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '1.5rem 0' }} />

            <Leaderboard currentUserId={session?.user?.email ?? undefined} />

        </main>
    );
}
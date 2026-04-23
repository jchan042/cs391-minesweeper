// app/leaderboard/page.tsx
import Leaderboard from '@/components/Leaderboard';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export default async function LeaderboardPage() {
    const session = await auth();

    return (
        <main>
            <Leaderboard currentUserId={session?.user?.id} />
        </main>
    );
}
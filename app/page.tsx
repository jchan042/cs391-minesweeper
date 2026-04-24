"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Login from '@/components/Login';
import styled from 'styled-components';

const Center = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: -2px;
    color: #333;
`;

const Sub = styled.p`
    color: #888;
    font-size: 1rem;
    margin: 0;
`;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to game if already logged in
  useEffect(() => {
    if (status === 'authenticated') router.push('/daily-game');
  }, [status, router]);

  if (status === 'loading') return null;

  return (
      <Center>
        <Title>MINESWEEPER</Title>
        <Sub>Sign in to play today's daily puzzle</Sub>
        <Login />
      </Center>
  );
}
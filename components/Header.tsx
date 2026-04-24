"use client";

import styled from "styled-components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import Logout from "@/components/Logout";

const StyledHeader = styled.header`
  background: linear-gradient(to bottom, #f5f5f59a, #dcdcdcdf);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: black;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// keeps the right section of the header aligned and spaced out
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsButton = styled.button`
  background-color: black;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: red;
  }
`;

const HomeButton = styled.button`
  background-color: black;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: red;
  }
`;

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  // get session data and redirect

  return (
    <StyledHeader>
      <h1>Minesweeper</h1>

      <RightSection>
        {/* if user is logged in, show stats and logout, otherwise show login */}
        {!session ? (
          <Login />
        ) : (
          <>
            <span>Hi, {session.user?.name}</span>
            
            <HomeButton onClick={() => router.push("/")}>
              Home
            </HomeButton>

            <StatsButton onClick={() => router.push("/stats")}>
              Stats
            </StatsButton>

            <Logout />
          </>
        )}
      </RightSection>
    </StyledHeader>
  );
}
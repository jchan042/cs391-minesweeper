"use client";

import styled from "styled-components";
import { signIn } from "next-auth/react";

const StyledButton = styled.button`
  background-color: black;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;

  &:hover {
    background-color: red;
  }
`;

export default function Login() {
  return (
    // triggers sign in and redirects to home 
    <StyledButton onClick={() => signIn("google", { callbackUrl: "/" })}>
      Sign in with Google
    </StyledButton>
  );
}
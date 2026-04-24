"use client";

import styled from "styled-components";
import { signOut } from "next-auth/react";

const StyledButton = styled.button`
  background-color: red;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

export default function Logout() {
  return (
    <StyledButton onClick={() => signOut({ callbackUrl: "/" })}>
      Logout
    </StyledButton>
  );
}

// instead of using action/index which is server side, we can use client side
// we should just impliment the on click right into the button component instead of having a separate function, since it's only used in one place and is simple enough to be inline
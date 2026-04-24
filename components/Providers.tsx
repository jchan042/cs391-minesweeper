"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

// wrapper component to provide session context to the entire app, 
// allowing us to access authentication state and user information across all components
// via useSession
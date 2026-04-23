"use client";

// need to add button styling

import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { redirectTo: "/home" })}
      className=""
    >
      Sign in with Google
    </button>
  );
};

export default Login;
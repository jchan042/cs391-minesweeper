'use server'

import { signIn, signOut } from "../api/auth/auth.js";

export async function doGoogleLogin(formData) {
    const action = formData.get("action");
    await signIn(action, { callbackUrl: "/home" });
}

export async function doGoogleLogout() {
    await signOut({ redirect: "/" })
}
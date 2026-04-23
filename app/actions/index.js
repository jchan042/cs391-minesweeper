'use server'

// handles directly within the ui

import { signIn, signOut } from "../api/auth/auth.js";

export async function doGoogleLogin(formData) {
    const action = formData.get("action");
    await signIn(action, { callbackUrl: "/home" });
}

export async function doGoogleLogout() {
    await signOut({ redirect: "/" })
}


// should i add error catching?
// https://medium.com/etechviral/google-authentication-with-nextauth-in-a-next-js-app-2b08c152b757
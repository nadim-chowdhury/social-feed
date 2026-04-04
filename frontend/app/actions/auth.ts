"use server";

import { cookies } from "next/headers";

export async function syncAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("jwt_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt_token");
}

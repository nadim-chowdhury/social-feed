import { ReactNode } from "react";

export interface ClientRequest {
  headers: { Authorization: `Bearer ${string}` };
}

export interface NextRequestMiddleware {
  cookies: {
    jwt_token: string;
  };
}

export interface CookiesOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

export type SyncAuthTokenAction = (token: string) => Promise<void>;
export type ClearAuthTokenAction = () => Promise<void>;

export interface EdgeRegexExclusion {
  assetPattern: ".*\\.(?:svg|png|jpg|jpeg|gif|webp)$";
}

export interface AuthHydrationContract {
  initialToken: string | null;
}

export interface GlobalAuthHydratorProps {
  token: string | null;
  children: ReactNode;
}

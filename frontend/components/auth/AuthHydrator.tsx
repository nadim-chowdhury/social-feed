"use client";

import { setCredentials } from "@/store/slices/authSlice";
import { GlobalAuthHydratorProps } from "@/types/auth";
import { useRef } from "react";
import { useDispatch } from "react-redux";

export function AuthHydrator({ token, children }: GlobalAuthHydratorProps) {
  const dispatch = useDispatch();
  const hydrated = useRef(false);

  if (!hydrated.current) {
    if (token) dispatch(setCredentials({ token }));
    hydrated.current = true;
  }

  if (!token)
    return (
      <div className="text-center p-10 font-bold text-red-500">
        Security Fault: Missing Token
      </div>
    );

  return <>{children}</>;
}

"use client";

import { useGetMeQuery } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { GlobalAuthHydratorProps } from "@/types/auth";
import { useEffect, useRef } from "react";
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

  const { data: user, isSuccess } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(
        setCredentials({
          user,
          token: token,
        }),
      );
    }
  }, [isSuccess, user, token, dispatch]);

  if (!user) return null;

  return <>{children}</>;
}

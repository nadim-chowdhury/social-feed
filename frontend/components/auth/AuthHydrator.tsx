"use client";

import { useGetMeQuery } from "@/services/authApi";
import { RootState } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";
import { GlobalAuthHydratorProps } from "@/types/auth";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export function AuthHydrator({ token, children }: GlobalAuthHydratorProps) {
  const dispatch = useDispatch();
  const hydrated = useRef(false);

  const authUser = useSelector((state: RootState) => state.auth.user);

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

  if (!authUser)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <span className="loader"></span>
      </div>
    );

  return <>{children}</>;
}

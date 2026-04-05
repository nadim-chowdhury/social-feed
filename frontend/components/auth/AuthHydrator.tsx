"use client";

import { clearAuthCookie } from "@/app/actions/auth";
import { useGetMeQuery } from "@/services/authApi";
import { RootState } from "@/store";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { GlobalAuthHydratorProps } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export function AuthHydrator({ token, children }: GlobalAuthHydratorProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const hydrated = useRef(false);

  const authUser = useSelector((state: RootState) => state.auth.user);

  if (!hydrated.current) {
    if (token) dispatch(setCredentials({ token }));
    hydrated.current = true;
  }

  const {
    data: user,
    isSuccess,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    const handleAuthFailure = async () => {
      await clearAuthCookie();
      dispatch(logout());
      router.replace("/login");
    };

    if (isError || !token) {
      handleAuthFailure();
    } else if (isSuccess && user) {
      dispatch(setCredentials({ user, token }));
    }
  }, [isSuccess, isError, user, token, dispatch, router]);

  if (!authUser)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <span className="loader"></span>
      </div>
    );

  return <>{children}</>;
}

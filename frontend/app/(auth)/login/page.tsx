"use client";

import { useLoginMutation } from "@/services/authApi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";
import {
  authFieldInput,
  authFieldLabel,
  authPrimaryBtn,
} from "@/lib/authFieldClasses";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await login(credentials).unwrap();
      console.log("Login Success!", result);
      router.push("/feed");
    } catch (err) {
      console.error("Login Failed", err);
    }
  };

  const errorMessage =
    error && "data" in error && error.data
      ? typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
        ? String((error.data as { message: unknown }).message)
        : "Login failed. Please try again."
      : error
        ? "Login failed. Please try again."
        : null;

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:min-h-[520px] lg:grid-cols-12 lg:gap-8">
      <div className="flex justify-center lg:col-span-7 xl:col-span-8">
        <div className="w-full max-w-[640px]">
          <Image
            src="/assets/images/login.png"
            alt=""
            width={633}
            height={420}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex justify-center lg:col-span-5 xl:col-span-4">
        <div className="w-full max-w-[420px] rounded-xl border border-gray-100 bg-white px-8 py-10">
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/images/logo.svg"
                alt="BuddyScript"
                width={161}
                height={48}
                className="h-auto w-auto max-w-[161px]"
              />
            </div>
            <p className="mb-2 text-sm text-gray-500">Welcome back</p>
            <h1 className="text-2xl font-semibold tracking-wide text-gray-900">
              Login to your account
            </h1>
          </div>

          <div className="text-center">
            <GoogleAuthButton label="Or sign-in with google" />
            <OrDivider />
          </div>

          <form className="w-full text-left" onSubmit={handleSubmit}>
            {errorMessage && (
              <p
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
            <div className="mb-4">
              <label htmlFor="login-email" className={authFieldLabel}>
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={credentials.email}
                onChange={handleChange}
                className={authFieldInput}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="login-password" className={authFieldLabel}>
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                className={authFieldInput}
                required
              />
            </div>

            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div className="form-check flex items-center gap-2">
                <input
                  id="login-remember"
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="auth-doc-radio"
                />
                <label
                  htmlFor="login-remember"
                  className="auth-doc-check-label select-none"
                >
                  Remember me
                </label>
              </div>
              <p className="text-sm leading-[1.4] text-[#1890FF]">
                Forgot password?
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={authPrimaryBtn}
            >
              {isLoading ? "Please wait…" : "Login now"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#1A91FF] hover:text-[#1580e6]"
            >
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

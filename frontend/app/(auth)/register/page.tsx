"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRegisterMutation } from "@/services/authApi";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { deriveNamesFromEmail } from "@/lib/deriveNamesFromEmail";
import {
  authFieldInput,
  authFieldLabel,
  authPrimaryBtn,
} from "@/lib/authFieldClasses";

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreedToTerms) {
      alert("Please agree to terms & conditions");
      return;
    }

    const { firstName, lastName } = deriveNamesFromEmail(credentials.email);

    try {
      const result = await register({
        firstName,
        lastName,
        email: credentials.email,
        password: credentials.password,
      }).unwrap();

      console.log("Registration Success!", result);
      router.push("/feed");
    } catch (err) {
      console.error("Registration Failed", err);
    }
  };

  const errorMessage =
    error && "data" in error && error.data
      ? typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
        ? String((error.data as { message: unknown }).message)
        : "Registration failed. Please try again."
      : error
        ? "Registration failed. Please try again."
        : null;

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:min-h-[520px] lg:grid-cols-12 lg:gap-8">
      <div className="flex justify-center lg:col-span-7 xl:col-span-8">
        <div className="w-full max-w-[640px]">
          <Image
            src="/assets/images/registration-hero.svg"
            alt=""
            width={633}
            height={480}
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
            <p className="mb-2 text-sm text-gray-500">Get Started Now</p>
            <h1 className="text-2xl font-semibold tracking-wide text-gray-900">
              Registration
            </h1>
          </div>

          <div className="text-center">
            <GoogleAuthButton label="Register with google" />
            <OrDivider />
          </div>

          <form className="w-full space-y-4 text-left" onSubmit={handleSubmit}>
            {errorMessage && (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
            <div>
              <label htmlFor="reg-email" className={authFieldLabel}>
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={credentials.email}
                onChange={handleChange}
                className={authFieldInput}
                required
              />
            </div>
            <div>
              <label htmlFor="reg-password" className={authFieldLabel}>
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={credentials.password}
                onChange={handleChange}
                className={authFieldInput}
                required
              />
            </div>
            <div>
              <label htmlFor="reg-confirm" className={authFieldLabel}>
                Repeat Password
              </label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={credentials.confirmPassword}
                onChange={handleChange}
                className={authFieldInput}
                required
              />
            </div>

            <div className="pt-2">
              <div className="form-check flex items-center gap-2">
                <input
                  id="reg-terms"
                  type="radio"
                  name="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="auth-doc-radio"
                />
                <label
                  htmlFor="reg-terms"
                  className="auth-doc-check-label select-none"
                >
                  I agree to terms & conditions
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={authPrimaryBtn}
              >
                {isLoading ? "Please wait…" : "Register now"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1A91FF] hover:text-[#1580e6]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

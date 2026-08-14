"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isPending, setIsPending] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsPending(true);

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const idToken =
        await credential.user.getIdToken();

      const response = await fetch(
        "/api/auth/session",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            idToken,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create session."
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Invalid email or password."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">

      <div className="w-full max-w-md">

        {/* Brand */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            MominEgg
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Admin Dashboard
          </p>

        </div>

        {/* Login Card */}

        <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">

          <div className="mb-6">

            <h2 className="text-2xl font-bold">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Login to manage your orders,
              products and customers.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={isPending}
                  required
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isPending}
                  required
                  className="h-11 w-full rounded-lg border bg-background px-10 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={isPending}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}

            </button>

          </form>

        </div>

      </div>

    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (result.error) {
          setMessage(result.error.message || "Sign up failed.");
          return;
        }

        setMessage("Account created successfully!");
        router.push("/dashboard");
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          setMessage(result.error.message || "Sign in failed.");
          return;
        }

        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell narrow">
      <section className="card">
        <span className="eyebrow">BETTER AUTH</span>

        <h1>
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>

        <p className="muted">
          {mode === "signin"
            ? "Sign in to access your protected TripMate dashboard."
            : "Create a TripMate account to continue."}
        </p>

        <form onSubmit={handleSubmit} className="form">
          {mode === "signup" && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Khushi Mehta"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="khushi@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>

          {message && <p className="muted">{message}</p>}

          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          className="button secondary"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage("");
          }}
        >
          {mode === "signin"
            ? "Create a new account"
            : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
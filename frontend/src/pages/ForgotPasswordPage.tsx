import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to request password reset");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4">
      <div className="glass w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-white">Forgot Password</h1>
        {!sent ? (
          <>
            <p className="mt-2 text-sm text-secondary-300">
              Enter your email address and we will send you a reset link.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-secondary-100">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
                />
              </label>
              {error && <div className="text-xs text-danger-400">{error}</div>}
              <button
                type="submit"
                className="w-full rounded-xl bg-primary-500 px-4 py-2 text-white hover:bg-primary-400 focus:ring-2 focus:ring-primary-400 shadow-sm focus:outline-none"
              >
                Send Reset Link
              </button>
            </form>
            <div className="mt-6 text-sm">
              <Link className="text-primary-300 hover:text-primary-200" to="/login">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-4 text-sm text-secondary-200">
            If that email exists, we’ve sent a reset link. Please check your inbox.
            <div className="mt-4">
              <Link className="text-primary-300 hover:text-primary-200" to="/login">
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

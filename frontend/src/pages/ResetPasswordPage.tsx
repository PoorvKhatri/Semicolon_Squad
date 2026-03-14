import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../api";

export default function ResetPasswordPage() {
  const [search] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = search.get("token");
    if (t) setToken(t);
  }, [search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4">
      <div className="glass w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
        {!success ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-secondary-100">Token</span>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-secondary-100">New Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-secondary-100">Confirm Password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              />
            </label>
            {error && <div className="text-xs text-danger-400">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-500 px-4 py-2 text-white hover:bg-primary-400 focus:ring-2 focus:ring-primary-400 shadow-sm focus:outline-none"
            >
              Reset Password
            </button>
            <div className="text-sm">
              <Link className="text-primary-300 hover:text-primary-200" to="/login">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-6 text-sm text-secondary-200">
            Password reset successful. Redirecting to login…
          </div>
        )}
      </div>
    </div>
  );
}

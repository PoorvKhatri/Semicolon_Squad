import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginToken, registerUser } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  type LoginForm = { loginId: string; password: string };
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>();

  

  const onSubmitLogin = async (values: LoginForm) => {
    setLoginError(null);
    try {
      const res = await loginToken(values.loginId, values.password);
      const token = res.data?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
        navigate("/dashboard");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Invalid credentials";
      setLoginError(msg);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-wide text-rose-300">Sign in</h1>
          <div className="mt-4 flex items-center justify-center">
            <div className="rounded-full border border-rose-400/50 bg-white/5 px-4 py-1 text-rose-200 text-sm">
              CoreInventory
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          {/* Login Card */}
          <div className="rounded-3xl border border-rose-400/30 bg-black/30 p-6 shadow-soft">
            <div className="mx-auto mb-4 h-10 w-16 rounded-xl border border-rose-400/40 bg-white/5" />
            <h2 className="text-xl font-semibold text-white">Login</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmitLogin(onSubmitLogin)}>
              <label className="block">
                <span className="text-sm font-medium text-rose-200">Login Id</span>
                <input
                  type="text"
                  {...registerLogin("loginId", { required: true })}
                  className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                />
                {loginErrors.loginId && <span className="mt-1 block text-xs text-rose-300">Login Id is required</span>}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-rose-200">Password</span>
                <input
                  type="password"
                  {...registerLogin("password", { required: true })}
                  className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                />
                {loginErrors.password && <span className="mt-1 block text-xs text-rose-300">Password is required</span>}
              </label>
              {loginError && <div className="text-xs text-rose-300">{loginError}</div>}
              <button
                type="submit"
                className="w-full rounded-xl border border-rose-400/40 bg-rose-500/90 px-4 py-2 text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
              >
                SIGN IN
              </button>
              <div className="text-center text-xs text-rose-200">
                <Link className="hover:text-rose-100" to="/forgot-password">Forgot Password?</Link>
                <span className="mx-2">|</span>
                <Link className="hover:text-rose-100" to="/signup">Sign Up</Link>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}

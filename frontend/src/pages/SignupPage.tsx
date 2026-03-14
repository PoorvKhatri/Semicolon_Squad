import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginToken, registerUser } from "../api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);

  type SignupForm = { loginId: string; name: string; email: string; password: string; confirmPassword: string };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = async (values: SignupForm) => {
    setSignupError(null);
    try {
      await registerUser(values.email, values.password, values.loginId, values.name);
      const res = await loginToken(values.loginId, values.password);
      const token = res.data?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Sign up failed";
      setSignupError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-rose-400/30 bg-black/30 p-6 shadow-soft">
        <div className="mx-auto mb-4 h-10 w-16 rounded-xl border border-rose-400/40 bg-white/5" />
        <h2 className="text-xl font-semibold text-white text-center">Sign up</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm font-medium text-rose-200">Login Id</span>
            <input
              type="text"
              {...register("loginId", {
                required: true,
                pattern: { value: /^[A-Za-z0-9_]{6,12}$/, message: "6–12 chars, letters/numbers/_ only" },
              })}
              className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
            />
            {errors.loginId && <span className="mt-1 block text-xs text-rose-300">{errors.loginId.message || "Login Id is required"}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-rose-200">Full Name</span>
            <input
              type="text"
              {...register("name", { required: true })}
              className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
            />
            {errors.name && <span className="mt-1 block text-xs text-rose-300">Full name is required</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-rose-200">Email</span>
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
            />
            {errors.email && <span className="mt-1 block text-xs text-rose-300">Email is required</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-rose-200">Password</span>
            <input
              type="password"
              {...register("password", {
                required: true,
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                  message: "≥8 chars, upper, lower, digit, special",
                },
              })}
              className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
            />
            {errors.password && <span className="mt-1 block text-xs text-rose-300">{errors.password.message || "Password is required"}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-rose-200">Confirm Password</span>
            <input
              type="password"
              {...register("confirmPassword", {
                required: true,
                validate: (val) => val === watch("password") || "Passwords do not match",
              })}
              className="mt-1 block w-full rounded-xl border border-rose-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
            />
            {errors.confirmPassword && <span className="mt-1 block text-xs text-rose-300">{errors.confirmPassword.message || "Confirmation required"}</span>}
          </label>
          {signupError && <div className="text-xs text-rose-300">{signupError}</div>}
          <button
            type="submit"
            className="w-full rounded-xl border border-rose-400/40 bg-rose-500/90 px-4 py-2 text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
          >
            SIGN UP
          </button>
          <div className="text-center text-xs text-rose-200">
            <span>Already have an account? </span>
            <Link className="hover:text-rose-100" to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

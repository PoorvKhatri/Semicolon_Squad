import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginToken, registerUser } from "../api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);

  type SignupForm = { username: string; name: string; email: string; password: string; confirmPassword: string };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = async (values: SignupForm) => {
    setSignupError(null);
    try {
      await registerUser(values.email, values.password, values.username, values.name);
      const res = await loginToken(values.username, values.password);
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
      <div className="w-full max-w-lg rounded-3xl border border-green-400/30 bg-black/30 p-6 shadow-soft">
        <div className="mx-auto mb-4 flex justify-center">
          <img src="/logo.png" alt="CoreInventory Logo" className="h-24 w-auto object-contain" />
        </div>
        <h2 className="text-xl font-semibold text-white text-center">Sign up</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm font-medium text-green-200">Username</span>
            <input
              type="text"
              {...register("username", {
                required: true,
                pattern: { value: /^[A-Za-z0-9_]{6,12}$/, message: "6–12 chars, letters/numbers/_ only" },
              })}
              className="mt-1 block w-full rounded-xl border border-green-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
            {errors.username && <span className="mt-1 block text-xs text-green-300">{errors.username.message || "Username is required"}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-green-200">Full Name</span>
            <input
              type="text"
              {...register("name", { required: true })}
              className="mt-1 block w-full rounded-xl border border-green-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
            {errors.name && <span className="mt-1 block text-xs text-green-300">Full name is required</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-green-200">Email</span>
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1 block w-full rounded-xl border border-green-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
            {errors.email && <span className="mt-1 block text-xs text-green-300">Email is required</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-green-200">Password</span>
            <input
              type="password"
              {...register("password", {
                required: true,
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                  message: "≥8 chars, upper, lower, digit, special",
                },
              })}
              className="mt-1 block w-full rounded-xl border border-green-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
            {errors.password && <span className="mt-1 block text-xs text-green-300">{errors.password.message || "Password is required"}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-green-200">Confirm Password</span>
            <input
              type="password"
              {...register("confirmPassword", {
                required: true,
                validate: (val) => val === watch("password") || "Passwords do not match",
              })}
              className="mt-1 block w-full rounded-xl border border-green-400/30 bg-black/50 px-3 py-2 text-secondary-100 shadow-sm placeholder:text-secondary-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30"
            />
            {errors.confirmPassword && <span className="mt-1 block text-xs text-green-300">{errors.confirmPassword.message || "Confirmation required"}</span>}
          </label>
          {signupError && <div className="text-xs text-green-300">{signupError}</div>}
          <button
            type="submit"
            className="w-full rounded-xl border border-green-400/40 bg-green-500/90 px-4 py-2 text-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/40"
          >
            SIGN UP
          </button>
          <div className="text-center text-xs text-green-200">
            <span>Already have an account? </span>
            <Link className="hover:text-green-100" to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

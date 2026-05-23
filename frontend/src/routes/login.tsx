// Fullscreen login page — first screen users see
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import bg from "@/assets/nature-bg.jpg";
import Logo from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login • Gujarat Bird AI" },
      { name: "description", content: "Sign in to Gujarat Bird AI to detect and explore Gujarat bird species." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dummy login — flags localStorage and redirects to landing
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("gba_loggedIn", "true");
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Nature background */}
      <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-emerald-900/70" />

      {/* Floating decorative blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/40 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl animate-[float_10s_ease-in-out_infinite]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md glass rounded-3xl p-8 shadow-elegant"
        >
          <div className="flex justify-center"><Logo /></div>

          <h1 className="mt-6 text-center text-2xl font-extrabold">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Sign in to start identifying Gujarat birds.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-white/70 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-border bg-white/70 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-primary" /> Remember me
              </label>
              <a href="#" className="font-semibold text-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl gradient-primary py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-white py-3 text-sm font-semibold hover:bg-secondary transition"
          >
            <FcGoogle className="h-5 w-5" /> Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-primary hover:underline">Create account</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

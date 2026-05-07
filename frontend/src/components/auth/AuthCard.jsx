import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";

export const AuthCard = () => {
  const { signInGoogle, signInEmail, signUpEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "login") {
        await signInEmail(email, password);
        toast.success("Welcome back to StudyForge AI");
      } else {
        await signUpEmail(email, password);
        toast.success("Account created successfully");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-glass">
      <div className="mb-6 flex gap-3">
        <Button variant={mode === "login" ? "primary" : "secondary"} onClick={() => setMode("login")}>
          Login
        </Button>
        <Button variant={mode === "signup" ? "primary" : "secondary"} onClick={() => setMode("signup")}>
          Sign up
        </Button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="College email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Secure password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button className="w-full" type="submit">
          {mode === "login" ? "Continue with email" : "Create your account"}
        </Button>
      </form>
      <Button className="mt-4 w-full" variant="secondary" onClick={signInGoogle}>
        Continue with Google
      </Button>
    </div>
  );
};

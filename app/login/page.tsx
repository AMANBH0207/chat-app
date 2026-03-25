"use client";

import "../ChatBot.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../store/Auth/authThunks";
import { UserLoginData } from "../store/Auth/authTypes";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UserLoginData>({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await dispatch(loginUser(form)).unwrap();
      toast.success(res?.message || "Login successful");
      router.push("/");
    } catch (err: unknown) {
      toast.error((err as string) || "Login failed");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h3 className="text-center mb-4">Welcome Back</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control auth-input"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control auth-input"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn auth-btn w-100 text-white">Login</button>
        </form>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <a href="/register" className="auth-link">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

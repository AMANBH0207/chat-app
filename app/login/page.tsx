"use client";

import "../ChatBot.css"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem("token", "dummy");
    router.push("/chat");
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

          <button className="btn auth-btn w-100 text-white">
            Login
          </button>
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
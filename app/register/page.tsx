"use client";
import "../ChatBot.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
type FormType = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register Data:", form);
    // router.push("/login");
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h3 className="text-center mb-4">Create Account</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control auth-input"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

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

          <button className="btn auth-btn w-100 text-white">Register</button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

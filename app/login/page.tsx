"use client";

import "../ChatBot.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../store/Auth/authThunks";
import { UserLoginData } from "../store/Auth/authTypes";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import Image from "next/image";
import { FiMail, FiLock, FiEye } from "react-icons/fi";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [form, setForm] = useState<UserLoginData>({
    email: "",
    password: "",
  });

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
      <div className="auth-card modern-auth-card">
        <div className="text-center mb-4">
          <div className="auth-logo-wrap">
            <Image
              src="/assets/images/logo/app_logo.png"
              alt="Conversa Logo"
              width={190}
              height={50}
            />
          </div>

          <h3 className="auth-title">Login</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 auth-input-wrap">
            <FiMail className="auth-icon left" />
            <input
              type="email"
              name="email"
              className="form-control auth-input with-icon"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2 auth-input-wrap">
            <FiLock className="auth-icon left" />
            <input
              type="password"
              name="password"
              className="form-control auth-input with-icon right-space"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <FiEye className="auth-icon right" />
          </div>

          <div className="text-end mb-3">
            <span className="forgot-text">Forgot password?</span>
          </div>

          <button className="btn auth-btn w-100 text-white">Login</button>
        </form>

        <p className="mt-4 text-center auth-bottom-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
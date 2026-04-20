"use client";

import "../ChatBot.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../store/hooks";
import { registerUser } from "../store/Auth/authThunks";
import { toast } from "react-toastify";
import Image from "next/image";

import { FiUser, FiMail, FiLock, FiEye } from "react-icons/fi";

type FormType = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await dispatch(registerUser(form)).unwrap();
      toast.success(res?.message || "Registration successful");
      router.push("/login");
    } catch (err: unknown) {
      toast.error((err as string) || "Registration failed");
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

          <h3 className="auth-title">Sign Up</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 auth-input-wrap">
            <FiUser className="auth-icon left" />
            <input
              type="text"
              name="name"
              className="form-control auth-input with-icon"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="mb-3 auth-input-wrap">
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

          <button className="btn auth-btn w-100 text-white">Sign Up</button>
        </form>

        <p className="mt-4 text-center auth-bottom-text">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
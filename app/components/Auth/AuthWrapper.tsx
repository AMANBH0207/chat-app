"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { getMe } from "@/app/store/Auth/authThunks";
import AppLoader from "../AppLoader";

type AuthWrapperProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

export default function AuthWrapper({
  children,
  requireAuth = true,
}: AuthWrapperProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      await dispatch(getMe()).unwrap();
      if (!requireAuth) {
        router.replace("/");
        return;
      }

      setLoading(false);
    } catch (error) {
      if (requireAuth) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const runAuth = async () => {
      await checkAuth();
    };

    runAuth();
  }, []);

  if (!loading) {
    return <AppLoader />;
  }

  return children;
}

import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.js";
import toast from "react-hot-toast";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://private-messaging-app.vercel.app/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setAuthUser(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error in login context", error);
      toast.error(error.message);
    }
  };
  return { loading, login };
}

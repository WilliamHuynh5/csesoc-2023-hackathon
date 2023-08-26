"use client";

import { post } from "@/utils/request";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import validator from "validator";
import Wave from "@/components/FunniWave/FunniWave";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const emailIsValid = validator.isEmail(email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const readyToSubmit = useMemo(() => {
    return emailIsValid && password;
  }, [email, password]);

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await post("http://localhost:49152/login", {
        email,
        password,
      }, false);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      router.push("/plan/travel/from");
    } catch (err) {
      setError(err.error.substring(0, err.error.indexOf('|')));
    }
  };

  return (
    <div className="h-screen relative flex flex-col gap-4 justify-center items-center w-full bg-gradient-to-b from-white to-slate-100">
      <h2 className="font-medium text-2xl">Login</h2>
      <form
        name="login-form"
        className="space-y-4 w-full max-w-[300px]"
        onSubmit={handleOnSubmit}
      >
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <label className="block" htmlFor="login-email">
            Email
          </label>
          <input
            className="outline-none border border-1 border-black/20 p-2 rounded-lg w-full duration-100 focus:shadow-glow"
            type="text"
            id="login-email"
            placeholder="Enter email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="block" htmlFor="login-password">
            Password
          </label>
          <input
            autoComplete="true"
            className="outline-none border border-1 border-black/20 p-2 rounded-lg w-full duration-100 focus:shadow-glow"
            type="password"
            id="login-password"
            placeholder="Enter password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          disabled={!readyToSubmit}
          className="bg-slate-400 text-white w-full py-2 rounded-lg duration-150 hover:bg-slate-500 disabled:bg-slate-200"
          type="submit"
        >
          Submit
        </button>
      </form>
      <p>Don't have an account yet? <Link className="text-blue-500 duration-150 hover:underline" href="/register">Register</Link></p>
      <div className="absolute bottom-0 h-fit opacity-20">
        <Wave />
      </div>
      <div className="absolute top-0 h-fit opacity-20 rotate-180">
        <Wave />
      </div>
    </div>
  );
}

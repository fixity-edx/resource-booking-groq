import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Signup(){
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try{
      setLoading(true);
      const res = await api.post("/auth/signup", { name, email, password });
      setToken(res.data.token);
      nav("/", { replace: true });
    }catch(error){
      setErr(error?.response?.data?.message || error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] glass p-6">
        <h1 className="text-2xl font-extrabold">Signup</h1>
        <p className="text-slate-300 text-sm mt-2">Signup as user. Admin role set in MongoDB.</p>

        {err ? <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{err}</div> : null}

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars" />
          <Button disabled={loading} type="submit">{loading ? "Creating..." : "Sign Up"}</Button>
        </form>

        <div className="text-sm text-slate-300 mt-4">
          Already have account? <Link className="text-blue-300 hover:text-blue-200" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

import { jwtDecode } from "jwt-decode";

export function setToken(t){ localStorage.setItem("token", t); }
export function clearToken(){ localStorage.removeItem("token"); }
export function getToken(){ return localStorage.getItem("token"); }

export function getUser(){
  const t = getToken();
  if(!t) return null;
  try{ return jwtDecode(t); }catch{ return null; }
}

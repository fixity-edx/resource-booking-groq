import React from "react";

export default function Input({ label, ...props }){
  return (
    <label className="block">
      {label ? <div className="text-sm text-slate-300 mb-1">{label}</div> : null}
      <input
        {...props}
        className={"w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/60 "+(props.className||"")}
      />
    </label>
  );
}
